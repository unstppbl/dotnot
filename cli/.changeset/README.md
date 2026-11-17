# CLI changesets

This is the standalone Changesets project for the private `@unstppbl/dotnot-cli`
package. It is independent from the app's root `.changeset/` inbox and version.

From `cli/`, run `bun run changeset` for a change to packaged CLI behavior.
Choose the CLI semver bump and describe the effect on CLI users. Do not add an
empty CLI changeset for repository docs outside the packaged `cli/README.md`,
tests, or release-pipeline maintenance.

Publishing is disabled for this fork. A future release process can consume these
fragments and regenerate `cli/CHANGELOG.md` after package ownership is configured.
