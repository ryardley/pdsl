const t = require("@babel/types");
const { types } = require("pdsl/grammar");

function booleanLiteral(pdslNode) {
  return t.booleanLiteral(pdslNode.token);
}

function predicateLiteral(pdslNode) {
  switch (`${pdslNode}`) {
    case "Email":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("regx")),
        [t.identifier("Email")]
      );
    case "{}":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("deep")),
        [t.objectExpression([])]
      );
    case "[]":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("deep")),
        [t.arrayExpression([])]
      );
    case '""':
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("deep")),
        [t.stringLiteral("")]
      );
    case "Number":
    case "number":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Number")]
      );
    case "Object":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Object")]
      );
    case "Array":
    case "array":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Array")]
      );
    case "null":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("val")),
        [t.identifier("null")]
      );
    case "undefined":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("val")),
        [t.identifier("undefined")]
      );
    case "Function":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Function")]
      );
    case "Symbol":
    case "symbol":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Symbol")]
      );
    case "String":
    case "string":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("String")]
      );
    case "Boolean":
    case "boolean":
      return t.callExpression(
        t.memberExpression(t.identifier("helpers"), t.identifier("prim")),
        [t.identifier("Boolean")]
      );
    case "!":
      return t.memberExpression(
        t.identifier("helpers"),
        t.identifier("falsey")
      );
    case "!!":
      return t.memberExpression(
        t.identifier("helpers"),
        t.identifier("truthy")
      );
    case "*":
      return t.memberExpression(
        t.identifier("helpers"),
        t.identifier("wildcard")
      );
    case "_":
      return t.memberExpression(
        t.identifier("helpers"),
        t.identifier("extant")
      );
    default:
      throw new Error("Unknown pdslNode: ", pdslNode.toString());
  }
}

function symbolLiteral(pdslNode) {
  const { token } = pdslNode;
  return t.stringLiteral(token);
}

function numericLiteral(pdslNode) {
  const { token } = pdslNode;
  return t.numericLiteral(token);
}

function stringLiteral(pdslNode) {
  const { token } = pdslNode;
  return t.stringLiteral(token);
}

// return the relevant babel node for the given pdslNode literal
function literal(pdslNode) {
  const toBabelNode = {
    [types.BooleanLiteral]: booleanLiteral,
    [types.PredicateLiteral]: predicateLiteral,
    [types.SymbolLiteral]: symbolLiteral,
    [types.NumericLiteral]: numericLiteral,
    [types.StringLiteral]: stringLiteral
  }[pdslNode.type];

  return toBabelNode(pdslNode);
}

module.exports = {
  predicateLiteral,
  booleanLiteral,
  symbolLiteral,
  numericLiteral,
  stringLiteral,
  literal
};
