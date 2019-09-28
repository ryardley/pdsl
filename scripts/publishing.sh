
publish_to_dist_tag() {
  local DIST_TAG = $1
  $(yarn bin)/lerna publish from-package --dist-tag "$DIST_TAG" --registry https://registry.npmjs.org/
}

promote_next_to_latest() {
  $(yarn bin)/lerna exec --stream --no-bail --concurrency 1 -- 'PKG_VERSION=$(npm v . dist-tags.next); [ -n "$PKG_VERSION" ] && ( npm dist-tag add ${LERNA_PACKAGE_NAME}@${PKG_VERSION} latest ) || exit 0'
}