source ./scripts/standard-lib.sh

publish_to_dist_tag() {
  local dist_tag = "$1"
  exit_if_empty "$dist_tag" "dist_tag is empty exiting."
  exit_if_empty "$DANGEROUSLY_PUBLISH" "Mocking publishing to ${dist_tag}."
  $(yarn bin)/lerna publish from-package --dist-tag "$dist_tag" --registry https://registry.npmjs.org/
}

promote_next_to_latest() {
  exit_if_empty "$DANGEROUSLY_PUBLISH" "Mocking promoting next to latest."
  $(yarn bin)/lerna exec --stream --no-bail --concurrency 1 -- 'pkg_version=$(npm v . dist-tags.next); [ -n "$pkg_version" ] && ( npm dist-tag add ${LERNA_PACKAGE_NAME}@${pkg_version} latest ) || exit 0'
}