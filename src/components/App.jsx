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
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half is-offset-one-quarter">
              <WordForm handleAddWord={this.handleAddWord} />
              <Cloud words={this.state.words} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
