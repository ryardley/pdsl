import { getRawHelpers } from "../helpers/index";
const { val } = getRawHelpers();
import {
  isPredicateLookup,
  isVaradicFunction,
  isOperator,
  isLiteral
} from "./grammar";

const lookupPredicateFunction = (node, funcs) => {
  return funcs[node.token];
};

export function generator(input, funcs, ctx) {
  const [runnable] = input.reduce((stack, node) => {
    if (isPredicateLookup(node)) {
      stack.push(lookupPredicateFunction(node, funcs));
      return stack;
    }

    if (isLiteral(node)) {
      stack.push(node.runtime(ctx));
      return stack;
    }

    /* istanbul ignore next 
        because it flags the else as never 
        happening however I am not comfortable 
        enough to remove the if completely
        even though it would probably work */
    if (isOperator(node) || isVaradicFunction(node)) {
      const { arity, runtime } = node;
      const args = stack.splice(-1 * arity);
      stack.push(runtime(ctx)(...args));
      return stack;
    }
  }, []);

  return val(ctx)(runnable);
}
