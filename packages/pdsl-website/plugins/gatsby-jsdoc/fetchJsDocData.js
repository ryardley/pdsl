const jsdoc2md = require("jsdoc-to-markdown")

async function fetchJsDocData(files) {
  return await jsdoc2md.getTemplateData({
    files,
  })
}

exports.default = fetchJsDocData
