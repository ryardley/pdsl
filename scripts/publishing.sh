source ./scripts/standard-lib.sh

publish_to_dist_tag() {
  local dist_tag="$1"
  exit_if_empty "$dist_tag" "dist_tag is empty exiting."
  exit_if_empty "$LIVE_RUN" "Mocking publishing to ${dist_tag}."
  $(yarn bin)/lerna publish from-package --dist-tag "$dist_tag" --registry https://registry.npmjs.org/
}

promote_tag_to_tag() {
  local source_tag="$1"
  local destination_tag="$2"
  exit_if_empty "$LIVE_RUN" "Mocking promoting next to latest."
  echo "$source_tag" "$destination_tag"
  $(yarn bin)/lerna exec --stream --no-bail --concurrency 1 -- yarn promote-next-latest
}