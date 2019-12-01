const defaultConfig = { abortEarly: true };

class Context {
  constructor(options = {}) {
    this.reset();
    Object.assign(this, defaultConfig, options);
  }

  reset(options = {}) {
    this.errs = [];
    this.objStack = [];
    this.config = {};
    this.batch = [];
    this.isBatching = false;
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
    const message = msg.replace(/\$(\d+)/g, (...matchArgs) => {
      const [, argIndex] = matchArgs.slice(0, -2);
      return argstore[Number(argIndex) - 1] || "";
    });
    const collection = this.isBatching ? this.batch : this.errs;

    collection.push({
      path: this.objStack.join("."),
      message
    });
  }

  pushObjStack(key) {
    const out = this.objStack.push(key);
    return out;
  }

  popObjStack() {
    const key = this.objStack.pop();
    return key;
  }
  getErrors() {
    return this.errs;
  }
}

module.exports = Context;
