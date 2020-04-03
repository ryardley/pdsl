import { createVal } from "./val";

export const createEntry = ctx =>
  function entry(name, predicate) {
    // never going to fail so no need to do error reporting
    return [name, createVal(ctx)(predicate)];
  };
