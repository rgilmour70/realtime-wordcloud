import React, { Component } from 'react';

class WordForm extends Component {
  constructor(props) {
    super(props);
    this.addWord = this.addWord.bind(this);
  }

  addWord(e) {
    // Prevent the default behaviour of form submit
    e.preventDefault();

    // Get the value of the word box
    // and make sure it not some empty strings
    const word = e.target.elements.word.value.trim().toLowerCase();

    // Make sure word box is filled
    if (word) {
      const value = 1;
      const wordObject = { 'text': word, 'value': value };

      // Publish word
      /*global Ably*/
      const channel = Ably.channels.get('words');
      channel.publish('add_comment', wordObject, err => {
        if (err) {
          console.log('Unable to publish message; err = ' + err.message);
        }
      });

      // Clear input fields
      e.target.elements.word.value = '';
    }
  }

  render() {
    return (
      <div>
        <h1 className="title">What is your favorite fruit?</h1>
        <form onSubmit={this.addWord}>
          <div className="field">
            <div className="control">
              <input type="text" className="input" name="word" />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default WordForm;
