function p(...args) {
  console.log({ args });
}

const foo = p`Hello ${3} World ${"foo"} End!`;
