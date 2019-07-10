// eslint-disable-next-line
import React, { Component } from 'react';
import ReactWordCloud from 'react-wordcloud';
import { tallyWords } from '../utils/TallyWords';

// This component originally used map() to 
// display multiple Comment components.
const Cloud = (props) => {

  const wordObjs = tallyWords(props.words);

  return (
    <ReactWordCloud
      options={{
        rotations: 0,
        colors: ['#4682b4', '#ff8c42', '#ff3c38', '#a23e48'],
        fontSizes: [16, 36],
        fontFamily: 'sans-serif',
      }}
      words={wordObjs}
    />
  );

}

export default Cloud;
