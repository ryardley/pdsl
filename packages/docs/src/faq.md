---
name: F.A.Q.
---

# FAQ

## What does pdsl stand for?

Predicate Domain Specific Language.

## Why did you write this?

@ryardley had a need for it when filtering on events in an app working with [ts-bus](https://github.com/ryardley/ts-bus). He also wanted to learn how to create a compiler from scratch.

## Why would I ever use this?

We think PDSL is a great addition to working with predicates in JavaScript and hope you feel that way too. If there is something stopping you from wanting to use this in your projects we would like to know so [let us know about it here](https://github.com/ryardley/pdsl/issues/new) - perhaps we can fix your problem or prioritize it in our roadmap!

We don't know what's in your head and we want to make libraries that help more people get the most out of programming.

## How does this work?

It is comprised of a [grammar](packages/pdsl/grammar.js), a [lexer](packages/pdsl/lexer.js) a [parser](packages/pdsl/parser.js) and a [code generator](packages/pdsl/generator.js). It uses a version of the [shunting yard algorhythm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) to create the basic parser storing the output in [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) but using objects in an array instead of a tree. Then parsing was added for Varadic Functions. A lot of it was by trial and error.

There are better ways to do it. There are [plans to refactor to use a transducer pattern](https://github.com/ryardley/pdsl/issues/33) but there is also a plan to create a babel plugin which will [remove the need for compiler performance enhancement](https://github.com/ryardley/pdsl/issues/32). Nevertheless if you have tips and know how to do it better, faster, stronger or smaller, retaining semantic flexability and with no dependencies - we want to learn - [let us know about it here](https://github.com/ryardley/pdsl/issues/new).
