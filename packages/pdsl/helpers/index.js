const { ValidationError } = require("../lib/errors");
const Context = require("../lib/context");

const helpers = require("./helpers");

const createSchema = (compiler, ctx) => {
  return (...args) => {
    const predicateFn = compiler(ctx)(...args);
    return {
      unsafe_predicate: predicateFn,
      validateSync(input) {
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
      async validate(input) {
        return this.validateSync(input);
      },
      unsafe_rpn: predicateFn.unsafe_rpn
    };
  };
};

function passContextToHelpers(ctx, helpers) {
  const acc = {};
  const keys = Object.keys(helpers);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    acc[key] = helpers[key](ctx);
  }
  return acc;
}

const createRuntimeCompiler = compileTemplateLiteral => ctx => (
  strings,
  ...expressions
) => {
  const predicateFn = compileTemplateLiteral(strings, expressions, ctx);
  return predicateFn;
};

const createPredicateRunner = () => ctx => predicateCallback => {
  const predicateFn = predicateCallback(passContextToHelpers(ctx, helpers));
  return predicateFn;
};

// Create the default export without depending on the compiler
const createDefault = compileTemplateLiteral => {
  const compiler = compileTemplateLiteral
    ? // runtime compiling
      createRuntimeCompiler(compileTemplateLiteral)
    : // precompiled babel api
      createPredicateRunner();

  const returnObject = compiler(new Context());

  // Attach schema() and predicate() functions
  returnObject.configureSchema = options => {
    const ctx = new Context({
      schemaMode: true,
      abortEarly: false,
      captureErrors: true,
      throwErrors: true,
      ...options
    });

    return createSchema(compiler, ctx);
  };

  returnObject.schema = returnObject.configureSchema();

  returnObject.predicate = options => {
    return compiler(new Context(options));
  };

  return returnObject;
};

// TODO:  this may need consideration once we move to a
//        better delivery system eg. with rollup
module.exports = Object.assign(
  // Main export is the configureHelperFunction
  ctx => passContextToHelpers(ctx, helpers),
  // Merge on all the helpers configured to default
  passContextToHelpers(new Context(), helpers),
  // Add getter to get unconfigured helpers
  { getRawHelpers: () => helpers },
  // Add createDefault function
  { createDefault }
);
