const oldLog = console.log.bind(console);
global.console = {
  log: jest.fn(msg => {
    return process.env.DEBUG ? oldLog(msg) : undefined;
  }),

  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};
