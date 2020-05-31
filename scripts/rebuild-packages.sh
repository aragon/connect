#!/usr/bin/env sh
set -eu

# MODE is "all" by default (libs + examples).
# Set to "libs-only" to exclude the examples.
: "${MODE:=all}"

# Note: oao commands, are using a double negation (--ignore-src and !) because
# of an issue with the way oao handles --src and workspaces.
# See https://github.com/guigrpa/oao/issues/96

glob_packages=''
if [ "$MODE" == "libs-only" ]; then
  glob_packages='!packages/*'
fi

# Clean all the build artifacts.
echo 'Cleaning build artifacts…'
oao run-script --ignore-src "$glob_packages" clean --parallel

# Start by installing all the nested dependencies.
echo 'Installing dependencies…'
oao all --ignore-src "$glob_packages" 'yarn install' --parallel

# Build connect-core first, as the other packages depend on it.
# Ideally we would only build @aragon/connect and tsc would figure out the
# references, but it doesn’t seem to work: @aragon/connect-core doesn’t get
# built first.
# Note that oao is not strictly needed here as we want to execute the command
# on a single package, but using it results in a consistent output.
echo 'Building @aragon/connect-core…'
oao run-script --ignore-src '!packages/connect-core' build --parallel

# Build the connectors.
echo 'Building the connectors…'
oao run-script --ignore-src '!packages/connect-{thegraph,ethereum}' build --parallel

# Build connect and its references, the connectors.
echo 'Building @aragon/connect…'
oao run-script --ignore-src '!packages/connect' build --parallel

# Build the app connectors.
echo 'Building the app connectors…'
oao run-script --ignore-src '!packages/connect-thegraph-*' build --parallel

# Build the examples.
if [ $MODE != "libs-only" ]; then
echo 'Building the examples…'
oao run-script --ignore-src '!examples/*' build --parallel
fi
