import { ValidationError } from "../lib/errors";
import Context from "../lib/context";

import Helpers from "./helpers";

export const createSchema = (compiler: any, ctx: Context) => {
  return (...args: any[]) => {
    const predicateFn = compiler(ctx)(...args);
    return {
      unsafe_predicate: predicateFn,
      validateSync(input: any) {
        // Setting abortEarly to false
        // enables us to collect all errors
        ctx.reset({ abortEarly: false, captureErrors: true });

        // Run the test
        predicateFn(input);
        const errs = ctx.getErrors();

        // Throw errors
        if (ctx.throwErrors && errs.length > 0) {
          throw new ValidationError(errs[0].message, errs[0].path, errs);
        }

        // Return the errors
        return errs;
      },
      async validate(input: any) {
        return this.validateSync(input);
      },
      unsafe_rpn: predicateFn.unsafe_rpn
    };
  };
};

function passContextToHelpers(ctx: Context, helpers: typeof Helpers) {
  return {
    Email: helpers.Email(),
    Xc: helpers.Xc(),
    Nc: helpers.Nc(),
    Lc: helpers.Lc(),
    Uc: helpers.Uc(),
    LUc: helpers.LUc(),
    btw: helpers.btw(ctx),
    btwe: helpers.btwe(ctx),
    lt: helpers.lt(ctx),
    lte: helpers.lte(ctx),
    gt: helpers.gt(ctx),
    gte: helpers.gte(ctx),
    arrIncl: helpers.arrIncl(ctx),
    or: helpers.or(ctx),
    and: helpers.and(ctx),
    not: helpers.not(ctx),
    obj: helpers.obj(ctx),
    val: helpers.val(ctx),
    regx: helpers.regx(ctx),
    entry: helpers.entry(ctx),
    prim: helpers.prim(ctx),
    pred: helpers.pred(ctx),
    deep: helpers.deep(ctx),
    extant: helpers.extant(ctx),
    truthy: helpers.truthy(ctx),
    falsey: helpers.falsey(ctx),
    arrArgMatch: helpers.arrArgMatch(ctx),
    arrTypeMatch: helpers.arrTypeMatch(ctx),
    wildcard: helpers.wildcard(),
    strLen: helpers.strLen(ctx),
    arrLen: helpers.arrLen(ctx),
    validation: helpers.validation(ctx)
  };
}
type ConfiguredHelpers = ReturnType<typeof passContextToHelpers>;

type PredicateFn<T = any> = (input?: any) => input is T;

// type CompileTemplateLiteral = (
//   strings: TemplateStringsArray,
//   expressions: any[],
//   ctx: Context
// ) => PredicateFn;

type CompileTemplateLiteral = PredicateFactory;

type PredicateCb<T = any> = (a: ConfiguredHelpers) => PredicateFn<T>;

// p`{ name }`
// type PDSLFn = (
//   strings: TemplateStringsArray,
//   ...expressions: any[]
// ) => PredicateFn;

// type PredicateRunner = (predicateCb: PredicateCb) => PredicateFn;

type PredicateFactory = (...args: any[]) => PredicateFn;

type TemplateStringFactory = (
  strings: TemplateStringsArray,
  ...expressions: any[]
) => PredicateFn;

type CallbackFactory = (cb: PredicateCb) => PredicateFn;

type Compiler<P extends PredicateFactory> = (ctx: Context) => P;

// type PDSLDefaultObject<T> = (PDSLFn<T> | PredicateRunner<T>) & {
//   configureSchema?: any;
//   schema?: any;
//   predicate?: any;
// };

const createRuntimeCompiler = (
  compileTemplateLiteral: CompileTemplateLiteral
): Compiler<TemplateStringFactory> => (ctx: Context) => (
  strings: TemplateStringsArray,
  ...expressions: any[]
) => {
  const predicateFn = compileTemplateLiteral(strings, expressions, ctx);
  return predicateFn;
};

const createPredicateRunner = (): Compiler<CallbackFactory> => ctx => (
  predicateCallback: PredicateCb
) => {
  const predicateFn = predicateCallback(passContextToHelpers(ctx, Helpers));
  return predicateFn;
};

type Schema = ReturnType<typeof createSchema>;

type ConfigureSchema = (options?: any) => Schema;

type CreateDefaultReturnType<P extends PredicateFactory> = P & {
  configureSchema: ConfigureSchema;
  schema: Schema;
  predicate: (options: any) => P;
};

// Create the default export without depending on the compiler
export function createDefault(
  compileTemplateLiteral: TemplateStringFactory
): CreateDefaultReturnType<TemplateStringFactory>;
export function createDefault(
  compileTemplateLiteral: void
): CreateDefaultReturnType<CallbackFactory>;
export function createDefault(
  compileTemplateLiteral: any
): CreateDefaultReturnType<any> {
  const compiler =
    typeof compileTemplateLiteral !== "undefined"
      ? createRuntimeCompiler(compileTemplateLiteral)
      : createPredicateRunner();

  const defaultObject = compiler(new Context());

  const configureSchema = (options?) => {
    const ctx = new Context({
      schemaMode: true,
      abortEarly: false,
      captureErrors: true,
      throwErrors: true,
      ...options
    });

    return createSchema(compiler, ctx);
  };

  const predicate = options => {
    return compiler(new Context(options));
  };

  const schema = configureSchema();

  return Object.assign(defaultObject, {
    configureSchema,
    schema,
    predicate
  });
}

export const {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  LUc,
  btw,
  btwe,
  lt,
  lte,
  gt,
  gte,
  arrIncl,
  or,
  and,
  not,
  obj,
  val,
  regx,
  entry,
  prim,
  pred,
  deep,
  extant,
  truthy,
  falsey,
  arrArgMatch,
  arrTypeMatch,
  wildcard,
  strLen,
  arrLen,
  validation
} = passContextToHelpers(new Context(), Helpers);

export const getRawHelpers = () => Helpers;
