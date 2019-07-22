const { and, or, not, entry, obj } = require("./helpers");

module.exports = {
  OPERATORS: [
    { token: "\\:", arity: 2, helper: entry },
    { token: "\\}", arity: 0 },
    { token: "\\,", arity: 0 },
    { token: "\\|\\|", arity: 2, helper: or },
    { token: "\\&\\&", arity: 2, helper: and },
    { token: "\\!", arity: 1, helper: not },
    {
      token: "\\{",
      arity: -1,
      closingToken: "\\}",
      helper: obj,
      extract: t => parseInt(t.match(/^\{(\d+)/)[1])
    }
  ],
  IDENTIFIERS: [{ token: "[a-zA-Z0-9_-]+" }],
  LINKAGES: [
    {
      token: `@{LINK:\\d+}`,
      encode: n => `@{LINK:${n}}`,
      extract: t => t.match(/@{LINK:(\d+)/)[1]
    }
  ],
  PRECEDENCE: [{ token: `\\(` }, { token: `\\)` }]
};
