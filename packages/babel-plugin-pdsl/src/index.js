// const template = require("@babel/template").default;
const traverse = require("@babel/traverse").default;

const { generator } = require("./babel-generator");
const { unsafe_toAst } = require("../../pdsl");

// 1. Find TaggedTemplateExpression
// 2. If the identifier is p then continue
// 3. Get strings and nodeList
// 4. pass strings to the pdsl toAst function
// 5. pass the output from the toAst function to the babelGenerator along with the nodeList
// 6. The result of the babelGenerator will be the ast for the tagged template expression along side the helper Identifiers used.
// 7. Add the helper identifiers to the stored list of helper identifiers for the file.
// 8. Write out the imports to the head of the file

function findStringsAndAstNodeList(path) {
  if (path.node.tag.name !== "p") return;
  const { expressions: nodeList, quasis: templateElements } = path.node.quasi;
  const strings = templateElements.map(e => e.value.raw);
  return { strings, nodeList };
}

module.exports = function pdslPlugin({ template }) {
  const imps = [];
  return {
    name: "pdsl",
    visitor: {
      TaggedTemplateExpression(path) {
        if (path.node.tag.name !== "p") return;
        const { strings, nodeList } = findStringsAndAstNodeList(path);
        const { ast } = generator(unsafe_toAst(strings), nodeList);
        path.replaceWith(ast);
      },
      ImportDeclaration(path) {
        if (path.node.source.value !== "pdsl") return;
        console.log({ imps });
        path.replaceWith(
          template.ast(`const {not, or} = require("pdsl/helpers");`)
        );
      }
    }
  };
};
