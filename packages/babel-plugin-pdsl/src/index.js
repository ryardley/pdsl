const { generator } = require("./babel-generator");
const { unsafe_toRpnArray } = require("pdsl");
const t = require("@babel/types");

// 1. Find TaggedTemplateExpression
// 2. If the identifier is p then continue
// 3. Get strings and nodeList
// 4. pass strings to the pdsl toAst function
// 5. pass the output from the toAst function to the babelGenerator along with the nodeList
// 6. The result of the babelGenerator will be the ast for the tagged template expression along side the helper Identifiers used.
// 7. Add the helper identifiers to the stored list of helper identifiers for the file.
// 8. Write out the imports to the head of the file

function findStringsAndAstNodeList(path) {
  // if (path.node.tag.name !== "p") return;
  const { expressions: nodeList, quasis: templateElements } = path.node.quasi;
  const strings = templateElements.map(e => e.value.raw);
  return { strings, nodeList };
}

function replaceTaggedTemplateLiteralWithFunctions(path) {
  // Get the strings and function nodes
  const { strings, nodeList } = findStringsAndAstNodeList(path);

  // Create the PDSL rpn array
  const pdslRpnArray = unsafe_toRpnArray(strings);

  // Turn that into a babel AST
  const ast = generator(pdslRpnArray, nodeList, "_h");

  // Replace the node
  path.replaceWith(
    t.callExpression(t.identifier(path.node.tag.name), [
      t.arrowFunctionExpression([t.identifier("_h")], ast)
    ])
  );
}

// Swap out import path
// TODO: just add the helpers import with a unique identifier
function addHelpersImportPath(
  path,
  helpersIdentifier,
  specifiers,
  useRequire = false,
  { template }
) {
  // console.log(specifiers.map(s => s.node.local.name));
  const defaults = specifiers
    .filter(s => s.type === "ImportDefaultSpecifier")
    .map(s => s.node.local.name)
    .join(""); // should only be one

  const named = specifiers.filter(s => s.type === "ImportSpecifier");

  if (useRequire) {
    path.insertBefore(
      template.ast(`const ${helpersIdentifier} = require("pdsl/helpers");`)
    );
  } else {
    path.insertBefore(
      template.ast(`import ${helpersIdentifier} from "pdsl/helpers";`)
    );
  }

  const internalId = getUid(path, "pdslDefault");

  path.replaceWith(
    template.ast(
      `const ${internalId.name} = ${helpersIdentifier}.createDefault();`
    )
  );

  if (defaults) {
    path.insertAfter(template.ast(`const ${defaults} = ${internalId.name};`));
  }

  if (named.length > 0) {
    const namedImports = named.map(s => {
      const local = s.node.local.name;
      const imported = s.node.imported.name;
      if (local === imported) {
        return local;
      }
      return [imported, local].join(":");
    });
    if (namedImports) {
      path.insertAfter(
        template.ast(`const { ${namedImports} } = ${internalId.name};`)
      );
    }
  }
}

function getUid(path, seed) {
  return path.scope.generateUidIdentifier(seed);
}

function flatMap(arr, mapFn) {
  return arr.reduce((acc, x) => acc.concat(mapFn(x)), []);
}

function findVariableReferencesAsTemplateExpressionFromPath(path) {
  const varDeclarator = path.findParent(
    path => path.type === "VariableDeclarator"
  );
  const varBindings = varDeclarator.scope.bindings[varDeclarator.node.id.name];

  return varBindings.referencePaths
    .map(p => p.parentPath)
    .filter(pat => {
      return pat.type === "TaggedTemplateExpression";
    });
}

function handleDefaultSpecifier(rootPath, specifierName, config) {
  const bindings = rootPath.scope.bindings[specifierName];

  flatMap(bindings.referencePaths, refPath => {
    // pickup when called directly: pdsl`{name}`
    if (refPath.container.type === "TaggedTemplateExpression") {
      const defaultImportTaggedTemplateLiteral = refPath.parentPath;
      return defaultImportTaggedTemplateLiteral;
    }

    // pickup when called as member expression: const foo = pdsl.predicate(); foo`{name}`
    if (refPath.container.type === "MemberExpression") {
      if (
        refPath.container.property.name === "predicate" ||
        refPath.container.property.name === "configureSchema"
      ) {
        return findVariableReferencesAsTemplateExpressionFromPath(refPath);
      }
    }
    // Still need to cover the case pdsl.schema()`foo`
  }).forEach(ttl => {
    replaceTaggedTemplateLiteralWithFunctions(ttl, config);
  });
}

function handleNamedSpecifier(rootPath, specifierName, config) {
  const bindings = rootPath.scope.bindings[specifierName];

  flatMap(bindings.referencePaths, refPath => {
    // pickup when called directly: pdsl`{name}`
    if (refPath.container.type === "TaggedTemplateExpression") {
      const defaultImportTaggedTemplateLiteral = refPath.parentPath;
      return defaultImportTaggedTemplateLiteral;
    }
    return findVariableReferencesAsTemplateExpressionFromPath(refPath);
  }).forEach(ttl => {
    replaceTaggedTemplateLiteralWithFunctions(ttl, config);
  });
}

module.exports = function pdslPlugin(config) {
  return {
    name: "pdsl",
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== "pdsl") return;
        const helpersIdentifier = getUid(path, "pdslHelpers");

        const specifiers = path.get("specifiers");
        specifiers.forEach(specifierPath => {
          const specifierName = specifierPath.node.local.name;
          const rootPath = specifierPath.parentPath.parentPath;
          switch (specifierPath.type) {
            case "ImportDefaultSpecifier":
              handleDefaultSpecifier(rootPath, specifierName, config);
              break;
            case "ImportSpecifier":
              handleNamedSpecifier(rootPath, specifierName, config);
          }
        });

        addHelpersImportPath(
          path,
          helpersIdentifier.name,
          specifiers,
          false,
          config
        );
      },
      Identifier(path) {
        if (path.node.name !== "require") return;
        if (
          path.parentPath.node.arguments[0] &&
          path.parentPath.node.arguments[0].value !== "pdsl"
        ) {
          return;
        }
        const helpersIdentifier = getUid(path, "pdslHelpers");
        const varDeclaration = path.findParent(
          path => path.type === "VariableDeclaration"
        );
        const varDeclarator = path.findParent(
          path => path.type === "VariableDeclarator"
        );
        const specifierName = varDeclarator.node.id.name;
        const rootPath = varDeclarator.parentPath.parentPath;

        handleDefaultSpecifier(rootPath, specifierName, config);
        addHelpersImportPath(
          varDeclaration,
          helpersIdentifier.name,
          [
            {
              type: "ImportDefaultSpecifier",
              node: { local: { name: specifierName } }
            }
          ],
          true,
          config
        );
      }
    }
  };
};
