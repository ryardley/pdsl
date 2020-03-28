const { createAnd } = require("./and");
const { createArrArgMatch } = require("./arrArgMatch");
const { createArrIncludes } = require("./arrIncludes");
const { createArrLen } = require("./arrLen");
const { createArrTypeMatch } = require("./arrTypeMatch");
const { createBtw } = require("./btw");
const { createBtwe } = require("./btwe");
const { createDeep } = require("./deep");
const { createEntry } = require("./entry");
const { createExtant } = require("./extant");
const { createFalsey } = require("./falsey");
const { createGt } = require("./gt");
const { createGte } = require("./gte");
const { createLt } = require("./lt");
const { createLte } = require("./lte");
const { createNot } = require("./not");
const { createObj } = require("./obj");
const { createOr } = require("./or");
const { createPred } = require("./pred");
const { createPrim } = require("./prim");
const { createRegx, Email, Xc, Nc, Lc, Uc, LUc } = require("./regx");
const { createStrLen } = require("./strLen");
const { createTruthy } = require("./truthy");
const { createVal } = require("./val");
const { createWildcard } = require("./wildcard");
const { createValidation } = require("./validation");

module.exports = {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  LUc,
  btw: createBtw,
  btwe: createBtwe,
  lt: createLt,
  lte: createLte,
  gt: createGt,
  gte: createGte,
  arrIncl: createArrIncludes,
  or: createOr,
  and: createAnd,
  not: createNot,
  obj: createObj,
  val: createVal,
  regx: createRegx,
  entry: createEntry,
  prim: createPrim,
  pred: createPred,
  deep: createDeep,
  extant: createExtant,
  truthy: createTruthy,
  falsey: createFalsey,
  arrArgMatch: createArrArgMatch,
  arrTypeMatch: createArrTypeMatch,
  wildcard: createWildcard,
  strLen: createStrLen,
  arrLen: createArrLen,
  validation: createValidation
};
