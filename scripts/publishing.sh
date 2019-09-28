
publish_to_dist_tag() {
  local DIST_TAG = $1
  $(yarn bin)/lerna publish from-package --dist-tag "$DIST_TAG" --registry https://registry.npmjs.org/
}