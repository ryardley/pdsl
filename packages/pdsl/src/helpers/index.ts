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

type PredicateFn<T = any> = (input?: any) => input is T;

type BabelPredicateCallback<T = any> = (
  a: ReturnType<typeof passContextToHelpers>
) => PredicateFn<T>;

type Engine<T = any> = RuntimeEngine<T> | BabelEngine<T>;

type RuntimeEngine<T = any> = (
  strings: TemplateStringsArray,
  ...expressions: any[]
) => PredicateFn<T>;

type BabelEngine<T = any> = (cb: BabelPredicateCallback<T>) => PredicateFn<T>;

type Compiler<P extends Engine> = (ctx: Context) => P;

const createRuntimeCompiler = (
  engine: RuntimeEngine
): Compiler<RuntimeEngine> => (ctx: Context) => (
  strings: TemplateStringsArray,
  ...expressions: any[]
) => {
  const predicateFn = engine(strings, expressions, ctx);
  return predicateFn;
};

const createPredicateRunner = (): Compiler<BabelEngine> => ctx => (
  predicateCallback: BabelPredicateCallback
) => {
  const predicateFn = predicateCallback(passContextToHelpers(ctx, Helpers));
  return predicateFn;
};

type Schema = ReturnType<typeof createSchema>;

type ConfigureSchema = (options?: any) => Schema;

type CreateDefaultReturnType<P extends Engine> = P & {
  configureSchema: ConfigureSchema;
  schema: Schema;
  predicate: (options: any) => P;
};

export function createDefault<T = any>(
  engine: RuntimeEngine<T>
): CreateDefaultReturnType<RuntimeEngine<T>>;
export function createDefault<T = any>(
  engine: void
): CreateDefaultReturnType<BabelEngine<T>>;
export function createDefault(engine: any): CreateDefaultReturnType<any> {
  const compiler =
    typeof engine !== "undefined"
      ? createRuntimeCompiler(engine)
      : createPredicateRunner();

  const predicateEngine = compiler(new Context());

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

  return Object.assign(predicateEngine, {
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
