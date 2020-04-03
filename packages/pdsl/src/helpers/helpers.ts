import { createAnd } from "./and";
import { createArrArgMatch } from "./arrArgMatch";
import { createArrIncludes } from "./arrIncludes";
import { createArrLen } from "./arrLen";
import { createArrTypeMatch } from "./arrTypeMatch";
import { createBtw } from "./btw";
import { createBtwe } from "./btwe";
import { createDeep } from "./deep";
import { createEntry } from "./entry";
import { createExtant } from "./extant";
import { createFalsey } from "./falsey";
import { createGt } from "./gt";
import { createGte } from "./gte";
import { createLt } from "./lt";
import { createLte } from "./lte";
import { createNot } from "./not";
import { createObj } from "./obj";
import { createOr } from "./or";
import { createPred } from "./pred";
import { createPrim } from "./prim";
import { createRegx, Email, Xc, Nc, Lc, Uc, LUc } from "./regx";
import { createStrLen } from "./strLen";
import { createTruthy } from "./truthy";
import { createVal } from "./val";
import { createWildcard } from "./wildcard";
import { createValidation } from "./validation";

const helpers = {
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

export default helpers;
