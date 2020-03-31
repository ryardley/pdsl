import { parser } from "./parser";
import { lexer } from "./lexer";
import { generator } from "./generator";
import { getRawHelpers, createDefault } from "../helpers/index";
import { pretokenizer } from "./pretokenizer";

const { pred } = getRawHelpers();

// Utility functions
const flow = (...funcs) => input =>
  funcs.reduce((out, func) => func(out), input);

const debugRpnArray = rpnArray => rpnArray.map(a => a.toString()).join(" ");

function debugRpn(strings: TemplateStringsArray, ..._expressions: any[]) {
  return flow(toRpnArray, debugRpnArray)(strings);
}

function debugTokens(strings: TemplateStringsArray, ..._expressions: any[]) {
  return flow(pretokenizer, lexer, debugRpnArray)(strings);
}

const cleanup = a => a.filter(Boolean);

const toRpnArray = flow(pretokenizer, lexer, parser, cleanup);

const compileTemplateLiteral = (strings, expressions, ctx) => {
  const predicateFn = generator(
    toRpnArray(strings),
    expressions.map(pred(ctx)),
    ctx
  );
  predicateFn.unsafe_rpn = () => debugRpn(strings);
  return predicateFn;
};

export const unsafe_toRpnArray = toRpnArray;

// Create the default export for runtime compiling
const defaultObject = createDefault(compileTemplateLiteral);

export const unsafe_rpn = debugRpn;
export const unsafe_tokens = debugTokens;

const { configureSchema, schema, predicate } = defaultObject;
export { configureSchema, schema, predicate };

export default defaultObject;
