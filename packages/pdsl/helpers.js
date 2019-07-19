const btw = (a, b) => n => n > a && n < b;
const btwi = (a, b) => n => n >= a && n <= b;
const lt = a => n => n < a;
const lte = a => n => n <= a;
const gt = a => n => n > a;
const gte = a => n => n >= a;
const has = a => n => n.indexOf(a) !== -1;

const Email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

module.exports = { Email, btw, btwi, lt, lte, gt, gte, has };
