const fetchData = require("./fetchJsDocData").default
const crypto = require("crypto")

exports.sourceNodes = async ({ actions }, options) => {
  // console.log(options.path)
  if (!options || !options.files) {
    throw new Error("gatsby-jsdoc requires you set an options.files property")
  }
  const { createNode } = actions
  // Create nodes here, generally by downloading data
  // from a remote API.
  const data = await fetchData(options.files)
  // Process data into nodes.
  data.forEach(datum =>
    createNode({
      ...datum,
      children: [],
      internal: {
        type: `jsDocEntry`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(datum))
          .digest(`hex`),
      },
    })
  )
  // We're done, return.
  return
}
