export const tallyWords = (wordObjArray) => {
  const result = [];
  const seen = [];
  if (Array.isArray(wordObjArray)) {
    wordObjArray.forEach((wordObj) => {
      if (!seen.includes(wordObj.text)) {
        seen.push(wordObj.text);
        result.push(wordObj);
      } else {
        result.forEach((loggedWordObj, i) => {
          if (loggedWordObj.text === wordObj.text) {
            const v = loggedWordObj.value + wordObj.value;
            result.splice(i, 1, { text: wordObj.text, value: v });
          }
        });
      }
    });
    return result;
  }
  return null;
};