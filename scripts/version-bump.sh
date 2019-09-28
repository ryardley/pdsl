#!/bin/bash


version_bump() {
  # patch, minor or major
  local SEMVER_TYPE=$1

  exit_unless_valid_semver "$SEMVER_TYPE"

  $(yarn bin)/lerna version "$SEMVER_TYPE"
}

exit_unless_valid_semver() {
  local SEMVER_TYPE=$1
  if [ "$SEMVER_TYPE" != "patch" ] && [ "$SEMVER_TYPE" != "minor" ] && [ "$SEMVER_TYPE" != "major" ]; then 
    echo "Please provide update type: patch, minor major"
    exit 1;
  fi
}