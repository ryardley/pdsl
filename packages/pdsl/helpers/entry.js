const { createVal } = require("./val");

module.exports.createEntry = ctx =>
  function entry(name, predicate) {
    // never going to fail so no need to do error reporting
    return [name, createVal(ctx)(predicate)];
  };
