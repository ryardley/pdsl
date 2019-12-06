// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
function ValidationError(message, path, inner, fileName, lineNumber) {
  const instance = new Error(message, fileName, lineNumber);
  instance.name = "ValidationError";
  instance.path = path;
  instance.inner = inner;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  return instance;
}
ValidationError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

/* istanbul ignore next */
if (Object.setPrototypeOf) {
  Object.setPrototypeOf(ValidationError, Error);
} else {
  ValidationError.__proto__ = Error;
}

module.exports = {
  ValidationError
};
