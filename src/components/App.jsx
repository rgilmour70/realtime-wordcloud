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

    const urlInst = params.get("inst");
    const allowedInstructors = ("rg", "lk", "aj", "cm", "jr", "ks");
    const validInstructor = allowedInstructors.includes() ? urlInst : "rg";
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
      <div className="row justify-content-around">
        <div className="col-sm-6 col-md-10 main">
          <Label labelText={this.state.labelText} />
          <WordForm handleAddWord={this.handleAddWord} channel={this.channel} />
          <Cloud words={this.state.words} />
        </div>
      </div>
    );
  }
}

export default App;
