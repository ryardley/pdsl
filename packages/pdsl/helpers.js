const {
  identity,
  isDeepVal,
  isFunction,
  isPrimative,
  isRegEx
} = require("./utils");
const { ValidationError } = require("./errors");
const Context = require("./context");

const createErrorReporter = (
  key,
  ctx,
  msg,
  args,
  blockDownstream = false,
  disableDefault = false
) => callback => {
  // Much of the complexity here is determining if we should show downstream errors
  if (!ctx || !ctx.captureErrors) return callback();

  ctx.pushErrStack(key);
  const blockFurther = msg || blockDownstream;

  if (blockFurther) {
    ctx.blockErrors = ctx.errStack.join(".");
  }

  const result = callback();

  if (result === false && ctx) {
    const errPath = ctx.errStack.join(".");
    const errAllowed =
      !ctx.blockErrors ||
      msg ||
      (ctx.blockErrors.length !== errPath.length &&
        errPath.indexOf(ctx.blockErrors) !== 0);

    const message = msg || (!disableDefault && ctx.lookup(key));

    if (errAllowed && message) {
      ctx.reportError(message, ...args);
    }
  }
  if (blockFurther) {
    ctx.blockErrors = "";
  }
  ctx.popErrStack();
  return result;
};

/**
 * <h3>Between bounds</h3>
 * Return a function that checks to see if it's input is between two numbers not including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const createBtw = ctx =>
  function btw(a, b) {
    return function btwFn(n, msg) {
      return createErrorReporter("btw", ctx, msg, [n, a, b])(() => {
        const [min, max] = a < b ? [a, b] : [b, a];
        return n > min && n < max;
      });
    };
  };

/**
 * <h3>Between bounds or equal to</h3>
 * Return a function that checks to see if it's input is between two numbers including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const createBtwe = ctx =>
  function btwe(a, b) {
    return function btweFn(n, msg) {
      return createErrorReporter("btwe", ctx, msg, [n, a, b])(() => {
        const [min, max] = a < b ? [a, b] : [b, a];
        return n >= min && n <= max;
      });
    };
  };

/**
 * <h3>Less than</h3>
 * Return a function that checks to see if it's input is less than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createLt = ctx =>
  function lt(a) {
    return function ltFn(n, msg) {
      return createErrorReporter("lt", ctx, msg, [n, a])(() => {
        return n < a;
      });
    };
  };

/**
 * <h3>Less than or equal to</h3>
 * Return a function that checks to see if it's input is less than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createLte = ctx =>
  function lte(a) {
    return function lteFn(n, msg) {
      return createErrorReporter("lte", ctx, msg, [n, a])(() => {
        return n <= a;
      });
    };
  };

/**
 * <h3>Greater than</h3>
 * Return a function that checks to see if it's input is greater than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createGt = ctx =>
  function gt(a) {
    return function gtFn(n, msg) {
      return createErrorReporter("gt", ctx, msg, [n, a])(() => {
        return n > a;
      });
    };
  };
/**
 * <h3>Greater than or equal to</h3>
 * Return a function that checks to see if it's input is greater than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createGte = ctx =>
  function gte(a) {
    return function gteFn(n, msg) {
      return createErrorReporter("gte", ctx, msg, [n, a])(() => {
        return n >= a;
      });
    };
  };

/**
 * <h3>Array match</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrArgMatch(isNumeric, isNumeric, isNumeric)([1,2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3]); // true
 * arrArgMatch(isString, isNumeric, isNumeric, '...')([1,2,3]); // false
 * arrArgMatch(isString, isNumeric, isNumeric, '...')(['1',2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3,4]); // true
 * arrArgMatch(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} tests Either values, `['...', predicate]` or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createArrArgMatch = ctx =>
  function arrArgMatch(...tests) {
    return function matchFn(arr, msg) {
      return createErrorReporter("arrArgMatch", ctx, msg, [arr])(() => {
        const hasWildcard = tests.slice(-1)[0] === "...";
        let matches = hasWildcard || arr.length === tests.length;
        for (let i = 0; i < tests.length; i++) {
          const testVal = tests[i];
          const predicate =
            testVal === "..." ? createWildcard(ctx) : createVal(ctx)(testVal);
          const pass = predicate(arr[i]);
          matches = matches && pass;
        }
        return matches;
      });
    };
  };

/**
 * <h3>Array type match</h3>
 * Return a function that checks to see if an array contains only the values listed or if the predicate function provided returns true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrTypeMatch(isNumeric)([1,2,3]); // true
 * arrTypeMatch(isNumeric)([1,2,'3']); // false
 * arrTypeMatch(isNumeric)([]); // true
 * </code></pre>
 *
 * @param {function|*} test predicate function used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createArrTypeMatch = ctx =>
  function arrTypeMatch(test) {
    const predicate = createVal(ctx)(test);
    return function matchFn(arr, msg) {
      return createErrorReporter("arrTypeMatch", ctx, msg, [arr])(() => {
        if (!Array.isArray(arr)) return false;

        let matches = true;
        for (let i = 0; i < arr.length; i++) {
          matches = matches && predicate(arr[i]);
        }
        return matches;
      });
    };
  };

/**
 * <h3>Array holds</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * holds(a => a > 3, 2)([1,2,3]); // true
 * holds(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} args Either values or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createHolds = ctx =>
  function holds(...args) {
    return function holdsFn(n, msg) {
      return createErrorReporter("holds", ctx, msg, [n, ...args])(() => {
        let i, j;
        let fns = [];
        let success = [];

        // prepare args as an array of predicate fns and an array to keep track of success
        for (i = 0; i < args.length; i++) {
          const arg = args[i];
          fns.push(createVal(ctx)(arg));
          success.push(false);
        }

        // loop through array only once
        for (i = 0; i < n.length; i++) {
          const item = n[i];
          for (j = 0; j < fns.length; j++) {
            if (!success[j]) {
              const fn = fns[j];
              success[j] = success[j] || fn(item);
            }
          }
        }

        return success.reduce((a, b) => a && b);
      });
    };
  };

/**
 * <h3>Logical OR</h3>
 * Combine predicates to form a new predicate that ORs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createOr = ctx =>
  function or(left, right) {
    return function orFn(a, msg) {
      return createErrorReporter(
        "or",
        ctx,
        msg,
        [a, left, right],
        false, // dont block downstream
        true // disable default
      )(() => {
        const val = createVal(ctx);
        ctx.batchStart();
        const result = val(left)(a) || val(right)(a);
        if (!result) {
          ctx.batchCommit();
        }
        ctx.batchPurge();
        return result;
      });
    };
  };

/**
 * <h3>Logical AND</h3>
 * Combine predicates to form a new predicate that ANDs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createAnd = ctx =>
  function and(left, right) {
    return function andFn(a, msg) {
      return createErrorReporter(
        "and",
        ctx,
        msg,
        [a, left, right],
        false, // dont block downstream
        true // disable default
      )(() => {
        const val = createVal(ctx);
        return val(left)(a) && val(right)(a);
      });
    };
  };

/**
 * <h3>Logical NOT</h3>
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createNot = ctx =>
  function not(input) {
    return function notFn(a, msg) {
      return createErrorReporter("not", ctx, msg, [input, a])(() => {
        return !createVal(ctx)(input)(a);
      });
    };
  };

const createExtant = ctx =>
  function extant(a, msg) {
    return createErrorReporter("extant", ctx, msg, [a])(() => {
      return a !== null && a !== undefined;
    });
  };

/**
 * <h3>Truthy</h3>
 * A predicate that takes an input value and returns whether or not the value is truthy
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is truthy
 */
const createTruthy = ctx =>
  function truthy(a, msg) {
    return createErrorReporter("truthy", ctx, msg, [a])(() => {
      return !!a;
    });
  };

/**
 * <h3>Falsey</h3>
 * A predicate that takes an input value and returns whether or not the value is falsey
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is falsey
 */
const createFalsey = ctx =>
  function falsey(a, msg) {
    return createErrorReporter("falsey", ctx, msg, [a])(() => {
      return !a;
    });
  };

const createObj = ctx =>
  function obj(...entriesWithRest) {
    return function objFn(a, msg) {
      return createErrorReporter(
        "obj",
        ctx,
        msg,
        [a, entriesWithRest],
        false,
        true
      )(() => {
        const isExtant = createExtant(ctx);
        let hasRest = false;
        let entriesMatch = true;
        let entryCount = 0;

        // For loop is faster
        for (let i = 0; i < entriesWithRest.length; i++) {
          const entry = entriesWithRest[i];

          // Ignore rest and note we have one
          if (entry === "...") {
            hasRest = hasRest || true;
            continue;
          }

          // Extract key and predicate from the entry and run the predicate against the value
          const [key, predicate] = Array.isArray(entry)
            ? entry
            : [entry, isExtant];

          // Storing the object path on a global stack
          ctx.pushObjStack(key);

          let result;
          if (ctx.abortEarly) {
            result = isExtant(a) && predicate(a[key]);
          } else {
            // Ensure that the test is run no matter what the previous tests were
            // This is important for collecting all errors
            result = predicate(
              isExtant(a) ? a[key] : /* istanbul ignore next */ undefined
            );
          }

          // Popping the object path off the global stack
          ctx.popObjStack();

          entriesMatch = entriesMatch && result;
          // We just logged an entry track it
          entryCount++;
        }

        // If there was a rest arg we don't need to check length
        if (hasRest) return entriesMatch;

        // Check entry length
        return entriesMatch && Object.keys(a).length === entryCount;
      });
    };
  };

/**
 * <h3>Is strict equal to value</h3>
 * Takes an input value to form a predicate that checks if the input strictly equals by reference the value.
 *
 * @param {function|*} value The input value if already a fuction it will be returned
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createVal = ctx =>
  function val(value) {
    return typeof value === "function"
      ? value
      : function isVal(a, msg) {
          return createErrorReporter("val", ctx, msg, [a, value])(() => {
            return a === value;
          });
        };
  };

/**
 * <h3>Is deep equal to value</h3>
 * Takes an input value to form a predicate that checks if the input deeply equals the value.
 *
 * @param {function} value The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createDeep = ctx =>
  function deep(value) {
    const st = JSON.stringify(value);
    return function isDeepEquals(a, msg) {
      return createErrorReporter("deep", ctx, msg, [a, st])(() => {
        return st === JSON.stringify(a);
      });
    };
  };

/**
 * <h3>Regular Expression predicate</h3>
 * Forms a predicate from a given regular expression
 *
 * @param {RegExp} rx The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createRegx = ctx =>
  function regx(rx, msg) {
    const rgx = typeof rx === "function" ? rx(ctx) : rx;
    return function testRegx(a) {
      return createErrorReporter("regx", ctx, msg, [a, rx])(() => {
        return rgx.test(a);
      });
    };
  };

/**
 * <h3>Primative predicate</h3>
 * Forms a predicate from a given JavaSCript primative object to act as a typeof check for the input value.
 *
 * Eg. <pre><code>
 * prim(Function)(() => {}); // true
 * prim(Number)(6); // true
 * </code></pre>
 *
 * @param {object} primative The input primative one of Array, Boolean, Number, Symbol, BigInt, String, Function, Object
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createPrim = ctx =>
  function prim(primative) {
    if (primative.name === "Array") {
      return function isArray(a, msg) {
        return createErrorReporter("prim", ctx, msg, [a, primative.name])(
          () => {
            return Array.isArray(a);
          }
        );
      };
    }
    return function isPrimative(a, msg) {
      return createErrorReporter("prim", ctx, msg, [a, primative.name])(() => {
        return typeof a === primative.name.toLowerCase();
      });
    };
  };

function createExpressionParser(ctx, expression) {
  if (isFunction(expression)) {
    if (isPrimative(expression)) return createPrim(ctx);
    return identity;
  }
  if (isRegEx(expression)) return createRegx(ctx);
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
const createPred = ctx =>
  function pred(input) {
    const expParser = createExpressionParser(ctx, input);
    return expParser(input);
  };

const createStrLen = ctx =>
  function strLen(input) {
    return function strLenFn(a, msg) {
      return createErrorReporter(
        "strLen",
        ctx,
        msg,
        [a, input],
        true // block downstream
      )(() => {
        return typeof a === "string" && createVal(ctx)(input)(a.length);
      });
    };
  };

const createArrLen = ctx =>
  function arrLen(input) {
    return function arrLenFn(a, msg) {
      return createErrorReporter(
        "arrLen",
        ctx,
        msg,
        [a, input],
        true // block downstream
      )(() => {
        return Array.isArray(a) && createVal(ctx)(input)(a.length);
      });
    };
  };

const createWildcard = () =>
  function wilcard() {
    // never going to fail so no need to do error reporting
    return true;
  };

const createEntry = ctx =>
  function entry(name, predicate) {
    // never going to fail so no need to do error reporting
    return [name, createVal(ctx)(predicate)];
  };

const deprecate = (name, fn) => () => {
  /* istanbul ignore next */
  if (!process.env.PDSL_SUPPRESS_DEPRICATION_WARNINGS) {
    /* istanbul ignore next */
    console.log(`${name} is deprecated and will be removed soon.`);
  }
  return fn();
};

const Email = () => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

const Xc = deprecate("Xc", () => /(?=.*[^a-zA-Z0-9\s]).*/);
const Nc = deprecate("Nc", () => /(?=.*[0-9]).*/);
const Lc = deprecate("Lc", () => /(?=.*[a-z]).*/);
const Uc = deprecate("Uc", () => /(?=.*[A-Z]).*/);
const LUc = deprecate("LUc", () => /(?=.*[a-z])(?=.*[A-Z]).*/);

function passContextToHelpers(ctx, helpers) {
  const acc = {};
  const keys = Object.keys(helpers);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    acc[key] = helpers[key](ctx);
  }
  return acc;
}

const createValidation = () => msg =>
  function validation(predicate) {
    return (...args) => {
      return predicate(...args, msg); // add msg as the final arg
    };
  };

const createSchema = (compiler, ctx) => {
  return (...args) => {
    const predicateFn = compiler(ctx)(...args);
    return {
      validateSync(input) {
        // Setting abortEarly to false
        // enables us to collect all errors
        ctx.reset({ abortEarly: false, captureErrors: true });

        // Run the test
        predicateFn(input);
        const errs = ctx.getErrors();

        // Throw errors
        if (ctx.throwErrors && errs.length > 0) {
          if (errs.length > 1) {
            throw new ValidationError("Validation failed", "", errs);
          } else {
            const [singleError] = errs;
            throw new ValidationError(singleError.message, singleError.path);
          }
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

const _rawHelpers = {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  Lc,
  LUc,
  btw: createBtw,
  btwe: createBtwe,
  lt: createLt,
  lte: createLte,
  gt: createGt,
  gte: createGte,
  holds: createHolds,
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

const createRuntimeCompiler = compileTemplateLiteral => ctx => (
  strings,
  ...expressions
) => {
  const predicateFn = compileTemplateLiteral(strings, expressions, ctx);
  return predicateFn;
};

const createPredicateRunner = () => ctx => predicateCallback => {
  const predicateFn = predicateCallback(passContextToHelpers(ctx, _rawHelpers));
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
  returnObject.schema = options => {
    const ctx = new Context({
      schemaMode: true,
      abortEarly: false,
      captureErrors: true,
      throwErrors: true,
      ...options
    });

    return createSchema(compiler, ctx);
  };

  returnObject.predicate = options => {
    return compiler(new Context(options));
  };

  return returnObject;
};

// TODO:  this may need consideration once we move to a
//        better delivery system eg. with rollup
module.exports = Object.assign(
  // Main export is the configureHelperFunction
  ctx => passContextToHelpers(ctx, _rawHelpers),
  // Merge on all the helpers configured to default
  passContextToHelpers(new Context(), _rawHelpers),
  // Add getter to get unconfigured helpers
  { getRawHelpers: () => _rawHelpers },
  // Add createDefault function
  { createDefault }
);
