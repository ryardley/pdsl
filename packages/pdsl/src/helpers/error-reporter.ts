export const createErrorReporter = (
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
