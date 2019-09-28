# Release Flow

1. New features are created on `develop`
1. When a new feature is merged to develop it is published to a semver version on the `next` dist-tag using the `release:[minor|major|patch]` script
1. When the `next` release is considered stable `develop` is merged to master.
1. On merge to master the publish:latest script is run.

## Running publishing scripts

Publishing scripts can only be run when the env var is set:

```
DANGEROUSLY_PUBLISH=1 yarn release:patch
```
