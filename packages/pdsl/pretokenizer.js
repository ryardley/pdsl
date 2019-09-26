function encode(num) {
  return `@{LINK:${num}}`;
}

function pretokenizer(stringArray) {
  return stringArray.reduce(
    (acc, item, index) =>
      index > 0 ? acc + encode(index - 1) + item : acc + item,
    ""
  );
}

module.exports = { pretokenizer };

//
