# Release Flow

1. New features are created on feature branches and merged to `master`
1. When a new feature is merged it is published to a semver version on the `next` dist-tag using the `release:[minor|major|patch]` script
1. When the `next` release is considered stable the publish:latest script is run which will bring the `next` tag inline with the `latest` tag.

## Running publishing scripts

Publishing scripts can only be run when the env var is set:

```
LIVE_RUN=1 yarn release:patch
```
