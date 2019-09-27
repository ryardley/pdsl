1. New features are created on `develop`
1. Each stable version is published to a semver version on the `next` dist-tag using the `release:[minor|major|patch]` script
1. When ready to release a branch to latest that branch is then merged to master
1. On merge the publish:latest script is run.
