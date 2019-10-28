const { generator } = require("./babel-generator");
const { unsafe_toAst } = require("pdsl");

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
  return {
    name: "pdsl",
    visitor: {
      // Find the import declaration:
      ImportDeclaration(pathImport) {
        if (pathImport.node.source.value !== "pdsl") return;
        // we are dealing with: import p from 'pdsl';
        pathImport.parentPath.traverse({
          // Look through the document
          TaggedTemplateExpression(path) {
            // if we find a tag called 'p' that is a tagged template literal...
            if (path.node.tag.name !== "p") return;
            // Get the strings and function nodes
            const { strings, nodeList } = findStringsAndAstNodeList(path);

            // Create the PDSL ast like array
            const pdslAstLikeArray = unsafe_toAst(strings);

            // Turn that into a babel AST
            const ast = generator(pdslAstLikeArray, nodeList);

            path.replaceWith(ast);
          }
        });

        pathImport.replaceWith(
          template.ast(`const helpers = require("pdsl/helpers");`)
        );
      }
    }
  };
};
