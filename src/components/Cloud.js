// eslint-disable-next-line
import React, { Component } from 'react';
import ReactWordCloud from 'react-wordcloud';

// This component originally used map() to 
// display multiple Comment components.
const Cloud = (props) => {

    return (
      <ReactWordCloud
        options={{
          rotations: 0,
          colors: ['#4682b4', '#ff8c42', '#ff3c38', '#a23e48'],
          fontSizes: [16, 36],
          fontFamily: 'sans-serif',
        }}
        words={props.words} 
      />
    );

}

export default Cloud;
