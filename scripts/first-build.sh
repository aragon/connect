#!/usr/bin/env sh

# Typescript is failing to apply project references on the very first time that
# the project is built.
# See
# https://www.typescriptlang.org/docs/handbook/project-references.html#caveats-for-project-references
# While a better solution is found, the workaround is to build the project
# twice on the first build.

yarn clean

echo "First build…"
yarn build &>/dev/null
yarn build
