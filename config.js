const { and, or, not, entry, obj } = require("./helpers");

module.exports = {
  OPERATORS: [
    { token: "\\:", arity: 2, helper: entry },
    { token: "\\}", arity: 0 },
    { token: "\\,", arity: 0 },
    { token: "\\|\\|", arity: 2, helper: or },
    { token: "\\&\\&", arity: 2, helper: and },
    { token: "\\!", arity: 1, helper: not },
    { token: "\\{", arity: -1, closingToken: "\\}", helper: obj }
  ],
  IDENTIFIERS: [{ token: `_E\\d+` }, { token: "[a-zA-Z0-9_-]+" }],
  PRECEDENCE: [{ token: `\\(` }, { token: `\\)` }]
};
