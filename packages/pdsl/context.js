const defaultConfig = { abortEarly: true };
const { lookup } = require("./i18n");

class Context {
  constructor(options = {}) {
    this.reset();
    Object.assign(this, defaultConfig, options);
  }

  reset(options = {}) {
    this.errs = [];
    this.errStack = [];
    this.objStack = [];
    this.config = {};
    this.batch = [];
    this.isBatching = false;
    this.blockErrors = "";
    Object.assign(this, options);
  }

  batchStart() {
    this.isBatching = true;
  }

  batchCommit() {
    this.errs = this.errs.concat(this.batch);
  }

  batchPurge() {
    this.batch = [];
    this.isBatching = false;
  }

  reportError(msg, ...argstore) {
    if (!msg) return;

    const message = msg.replace(/\$(\d+)/g, (...matchArgs) => {
      const [, argIndex] = matchArgs.slice(0, -2);
      return JSON.stringify(argstore[Number(argIndex) - 1]) || "";
    });

    const collection = this.isBatching ? this.batch : this.errs;

    collection.push({
      path: this.objStack.join("."),
      message
    });
  }

  lookup(key) {
    return lookup(key);
  }

  pushObjStack(key) {
    const out = this.objStack.push(key);
    return out;
  }

  popObjStack() {
    const key = this.objStack.pop();
    return key;
  }
  pushErrStack(key) {
    const out = this.errStack.push(key);
    return out;
  }

  popErrStack() {
    const key = this.errStack.pop();
    return key;
  }

  getErrors() {
    return this.errs;
  }
}

module.exports = Context;
