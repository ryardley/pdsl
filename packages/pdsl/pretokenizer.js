function pretokenizer(stringArray) {
  return stringArray.reduce(
    (acc, item, index) =>
      index > 0 ? acc + `_E${index - 1}` + item : acc + item,
    ""
  );
}

module.exports = { pretokenizer };
