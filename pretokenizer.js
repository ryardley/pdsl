const { LINKAGES } = require("./grammar");

// Are we gonna have ore pretokenizers?
const encode = LINKAGES[0].encode;

function pretokenizer(stringArray) {
  return stringArray.reduce(
    (acc, item, index) =>
      index > 0 ? acc + encode(index - 1) + item : acc + item,
    ""
  );
}

module.exports = { pretokenizer };
