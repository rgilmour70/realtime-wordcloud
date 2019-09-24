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
      <React.Fragment>
        <p className="question">What keywords would you use to research this topic?</p>
        <form onSubmit={this.addWord}>
          <div className="form-group">
            <input type="text" className="form-control" name="word" />
          </div>
          <div className="form-group">
            <button className="btn btn-primary">Enter</button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default WordForm;
