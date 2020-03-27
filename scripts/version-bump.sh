#!/bin/bash


version_bump() {
  # patch, minor or major
  local semver_type=$1
  exit_unless_valid_semver "$semver_type"
  $(yarn bin)/lerna version "$semver_type" --ignore-changes 'examples/*'
}

exit_unless_valid_semver() {
  local semver_type=$1
  if [ "$semver_type" != "patch" ] && [ "$semver_type" != "minor" ] && [ "$semver_type" != "major" ]; then 
    echo "Please provide update type: patch, minor major"
    exit 1;
  fi
}