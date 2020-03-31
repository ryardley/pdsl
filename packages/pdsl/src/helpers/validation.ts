import { createEntry } from "./entry";
import { createExtant } from "./extant";

export const createValidation = ctx => msg =>
  function validation(predicate) {
    if (typeof predicate === "string") {
      // if this is a string we are looking
      // at an entry key without a predicate.
      // eg { name <- "Some message" }
      // Here we need to expand out the predicate to a
      // full entry
      const newPredicate = createExtant(ctx);
      return createEntry(ctx)(predicate, a => newPredicate(a, msg));
    }
    return (...args) => {
      return predicate(...args, msg); // add msg as the final arg
    };
  };
