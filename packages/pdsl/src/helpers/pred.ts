import { createVal } from "./val";
import { createRegx } from "./regx";
import { createPrim } from "./prim";
import { createDeep } from "./deep";
import {
  identity,
  isDeepVal,
  isFunction,
  isPrimative,
  isPDSLSchema,
  isRegEx
} from "../lib/utils";

function createExpressionParser(ctx, expression) {
  // Composing functions
  if (isFunction(expression)) {
    if (isPrimative(expression)) return createPrim(ctx);
    return identity;
  }

  // Allow composing schemas
  if (isPDSLSchema(expression)) {
    return expression => expression.unsafe_predicate;
  }

  // Composing regex
  if (isRegEx(expression)) return createRegx(ctx);

  // {} [] etc.
  if (isDeepVal(expression)) return createDeep(ctx);

  return createVal(ctx);
}

/**
 * <h3>Predicate</h3>
 * Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.
 *
 * @param {*} input Anything parsable
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createPred = ctx =>
  function pred(input) {
    const expParser = createExpressionParser(ctx, input);
    return expParser(input);
  };
