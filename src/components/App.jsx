import React, { Component } from "react";
import WordForm from "./WordForm";
import Cloud from "./Cloud";
import Label from "./Label";
import { tallyWords } from "../utils/TallyWords";

class App extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    const urlPrompt = params.get("prompt");
    const bgColor = params.get("bg");
    const x11Colors = [
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "black",
      "blanchedalmond",
      "blue",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkgrey",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkslategrey",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dimgrey",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "fuchsia",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "gray",
      "green",
      "greenyellow",
      "grey",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgreen",
      "lightgrey",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightslategrey",
      "lightsteelblue",
      "lightyellow",
      "lime",
      "limegreen",
      "linen",
      "magenta",
      "maroon",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "navy",
      "oldlace",
      "olive",
      "olivedrab",
      "orange",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "purple",
      "red",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "silver",
      "skyblue",
      "slateblue",
      "slategray",
      "slategrey",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "teal",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "white",
      "whitesmoke",
      "yellow",
      "yellowgreen",
    ];
    if (bgColor && x11Colors.includes(bgColor)) {
      document.body.style.backgroundColor = bgColor;
    }

    const urlInst = params.get("inst");
    const allowedInstructors = ["rg", "lk", "aj", "cm", "jr", "ks"];
    const validInstructor = allowedInstructors.includes(urlInst)
      ? urlInst
      : "rg";

    this.handleAddWord = this.handleAddWord.bind(this);
    this.state = {
      words: [],
      channel: validInstructor,
      labelText: urlPrompt,
    };
  }

  componentDidMount() {
    /* global Ably */
    const channel = Ably.channels.get(this.channel);
    channel.attach();
    channel.once("attached", () => {
      channel.history({ untilAttach: true }, (err, page) => {
        /* create a new array with words */
        const words = Array.from(page.items, (item) => item.data);

        this.setState({ words });

        /* subscribe to new comments */
        channel.subscribe((msg, err) => {
          const wordObject = msg["data"];
          this.handleAddWord(wordObject);
        });
      });
    });
  }

  handleAddWord(word) {
    this.setState((prevState) => {
      const newWordsObjArr = [word].concat(prevState.words);
      const talliedWordsObjArr = tallyWords(newWordsObjArr);
      return {
        words: talliedWordsObjArr,
      };
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="row justify-content-around">
          <div className="col-sm-6 col-md-10 main">
            <Label labelText={this.state.labelText} />
            <WordForm
              handleAddWord={this.handleAddWord}
              channel={this.channel}
            />
            <Cloud words={this.state.words} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
