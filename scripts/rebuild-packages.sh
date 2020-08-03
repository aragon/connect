#!/usr/bin/env sh
set -eu

# MODE is "all" by default (libs + examples).
# Set to "libs-only" to exclude the examples.
: "${MODE:=all}"

# FAST is "0" by default, which means that tsc is used to build.
# Set to "1" to use esbuild.
: "${FAST:=0}"

# INSTALL_DEPS is "1" by default, which means that dependencies will be installed.
# Set to "0" to skip.
: "${INSTALL_DEPS:=1}"

# CLEAN_ARTIFACTS is "1" by default, which means that build artifacts will get removed before building.
# Set to "0" to skip.
: "${CLEAN_ARTIFACTS:=1}"

# Note: oao commands, are using a double negation (--ignore-src and !) because
# of an issue with the way oao handles --src and workspaces.
# See https://github.com/guigrpa/oao/issues/96

glob_packages=''
if [ "$MODE" = "libs-only" ]; then
  glob_packages='!packages/*'
fi

function esbuild_cmd()
{
  format=$1

  outdir="dist/esm"
  platform="browser"
  if [ "$format" == "cjs" ]; then
    outdir="dist/cjs"
    platform="node"
  fi

  ./node_modules/.bin/esbuild \
    --sourcemap \
    --target=es2019 \
    --bundle \
    --platform=$platform \
    --external:"bufferutil" \
    --external:"utf-8-validate" \
    --format=$format \
    --outdir="./$outdir" \
    --log-level=error \
    src/index.ts
}

function fast_build()
{
  package=$1

  echo "  ⏳@aragon/$package"

  cd "packages/$package"

  esbuild_cmd cjs & esbuild_cmd esm
  wait

  echo -e "\e[1A\e[K\u001b[32m  ✔️\u001b[0m @aragon/$package"
  cd ../..
}

# Clean all the build artifacts.
if [ "$CLEAN_ARTIFACTS" == "1" ]; then
  echo 'Cleaning build artifacts…'
  oao run-script --ignore-src "$glob_packages" clean --parallel
fi

# Start by installing all the nested dependencies.
if [ "$INSTALL_DEPS" == "1" ]; then
  echo 'Installing dependencies…'
  oao all --ignore-src "$glob_packages" 'yarn install' --parallel
fi

# Fast mode: we build all the packages and exit.
if [ "$FAST" == "1" ]; then
  echo
  echo " Building packages…"
  echo
  fast_build connect-core
  fast_build connect-ethereum
  fast_build connect-thegraph
  fast_build connect-thegraph-tokens
  fast_build connect-thegraph-voting
  fast_build connect
  fast_build connect-react
  echo
  exit 0
fi

# Building the types first.
# Note that oao is not strictly needed here as we want to execute the command
# on a single package, but using it results in a consistent output.
echo 'Building @aragon/connect-types…'
oao run-script --ignore-src '!packages/connect-types' build --parallel

# Then we build connect-core, as the other packages depend on it.
# Ideally we would only build @aragon/connect and tsc would figure out the
# references, but it doesn’t seem to work: @aragon/connect-core doesn’t get
# built first.
echo 'Building @aragon/connect-core…'
oao run-script --ignore-src '!packages/connect-core' build --parallel

# Build the connectors.
echo 'Building the connectors…'
oao run-script --ignore-src '!packages/connect-{thegraph,ethereum}' build --parallel

# Build the main connect library.
echo 'Building @aragon/connect…'
oao run-script --ignore-src '!packages/connect' build --parallel

# Build the app connectors and the React library.
echo 'Building the app connectors…'
oao run-script --ignore-src '!packages/connect-{voting,tokens,finance,react}' build --parallel

# Build the examples.
if [ $MODE != "libs-only" ]; then
echo 'Building the examples…'
oao run-script --ignore-src '!examples/*' build --parallel
fi
