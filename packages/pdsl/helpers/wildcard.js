module.exports.createWildcard = () =>
  function wilcard() {
    // never going to fail so no need to do error reporting
    return true;
  };
