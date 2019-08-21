const {
  val,
  not,
  or,
  obj,
  entry,
  pred
} = require("pdsl/helpers");

const notNil = val(not(or(val(null), val(undefined))));
const hasName = val(obj("name"));
const isTrue = val(true);
const hasNameWithFn = val(obj(entry("name", pred(a => a.length > 10))));