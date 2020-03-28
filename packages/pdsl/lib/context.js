const defaultConfig = { abortEarly: true };
const { lookup } = require("./i18n");

// TODO: Get this to compose state helper objects to
//      handle the objet stack and exact matching depth analysis

class Context {
  constructor(options = {}) {
    this.reset();
    Object.assign(this, defaultConfig, options);
  }

  reset(options = {}) {
    this.errs = [];
    this.errStack = [];
    this.objStack = []; // store our nested object path keys
    this.objExactStack = []; // store nested exact matching objects
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
    /* istanbul ignore next */
    if (!msg) return;

    const message = msg
      // interpolate values
      .replace(/\$(\d+)/g, (...matchArgs) => {
        const [, argIndex] = matchArgs.slice(0, -2);
        return JSON.stringify(argstore[Number(argIndex) - 1]);
      })
      // Fix up encoding issue with escaped quotes
      .replace(/\\\"/g, '"');

    const collection = this.isBatching ? this.batch : this.errs;

    collection.push({
      path: this.objStack.join("."),
      message
    });
  }

  lookup(key) {
    return lookup(key);
  }

  pushObjStack(key, isExactMatching) {
    this.objExactStack.push(isExactMatching);
    const out = this.objStack.push(key);
    return out;
  }

  popObjStack() {
    this.objExactStack.pop();
    const key = this.objStack.pop();
    return key;
  }

  getObjExactStack() {
    return this.objExactStack;
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
