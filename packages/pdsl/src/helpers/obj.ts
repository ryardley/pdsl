import { createErrorReporter } from "./error-reporter";
import { createExtant } from "./extant";

export const createObj = (ctx, isExactMatching = false) =>
  function obj(...entriesWithRest) {
    return function objFn(a, msg?) {
      return createErrorReporter(
        "obj",
        ctx,
        msg,
        [a, entriesWithRest],
        false,
        true
      )(() => {
        const isExtant = createExtant(ctx);

        const isDeepParentExactMatch = ctx
          .getObjExactStack()
          .reduce((acc, item) => acc || item, false);

        let isLooseMatching = !(isExactMatching || isDeepParentExactMatch);
        let entriesMatch = true;
        let entryCount = 0;

        for (let i = 0; i < entriesWithRest.length; i++) {
          const entry = entriesWithRest[i];

          // Ignore rest and note we have one
          if (entry === "...") {
            isLooseMatching = isLooseMatching || true;
            continue;
          }

          // Extract key and predicate from the entry and run the predicate against the value
          const [key, predicate] = Array.isArray(entry)
            ? entry
            : [entry, isExtant];

          // Storing the object key on a global stack for errors reporting
          ctx.pushObjStack(key, isExactMatching);

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
        if (isLooseMatching) return entriesMatch;

        // Check entry length
        return entriesMatch && Object.keys(a).length === entryCount;
      });
    };
  };
