import React, { Component } from 'react';
import WordForm from './WordForm';
import Cloud from './Cloud';
import { tallyWords } from '../utils/TallyWords';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.state = {
      words: []
    }
  }

  componentDidMount() {
    /* global Ably */
    const channel = Ably.channels.get('words');
   
    channel.attach();
    channel.once('attached', () => {
      channel.history((err, page) => {
        /* create a new array with words */
        const words = Array.from(page.items, item => item.data);

        this.setState({ words });

        /* subscribe to new comments */
        channel.subscribe((msg, err) => {
          const wordObject = msg['data'];
          this.handleAddWord(wordObject);
        });
      });
    });
  }

  handleAddWord(word) {
    this.setState(prevState => {
      const newWordsObjArr = [word].concat(prevState.words);
      const talliedWordsObjArr = tallyWords(newWordsObjArr);
      return {
        words: talliedWordsObjArr
      };
    });
  }

  render() {
    return (
      <div className="columns">
        <WordForm handleAddWord={this.handleAddWord} />
        <Cloud words={this.state.words} />
      </div>
    );
  }
}

export default App;
