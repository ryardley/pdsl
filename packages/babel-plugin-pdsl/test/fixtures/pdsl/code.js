import p from "pdsl";

const notNil = p`!(null|undefined)`;

const hasName = p`{name}`;

const isTrue = p`true`;

const hasNameWithFn = p`{name:${a => a.length > 10}}`;