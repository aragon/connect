#!/usr/bin/env sh
set -eu

# IMPORTANT: run this script from the root directory, it won’t work otherwise.

confirm() {
  while true; do
    printf "%s [Y/n] " "$1"
    read -r yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) echo "Exiting."; exit 0;;
        * ) break;;
    esac
  done
}

package_readme() {
  cat <<EOF
# @$1 [<img height="100" align="right" alt="" src="https://user-images.githubusercontent.com/36158/85128259-d201f100-b228-11ea-9770-76ae86cc98b3.png">](https://connect.aragon.org/)

[![](https://img.shields.io/github/package-json/v/$1?label=npm)](https://www.npmjs.com/package/@$1) [![](https://img.shields.io/bundlephobia/minzip/@$1)](https://bundlephobia.com/result?p=@$1) [![codecov](https://codecov.io/gh/aragon/connect/branch/master/graph/badge.svg)](https://codecov.io/gh/aragon/connect)

Please have a look at the [documentation website](https://connect.aragon.org/) for Aragon Connect. If you never used the library before, we highly recommend starting with the [Getting Started](https://connect.aragon.org/guides/getting-started) guide.
EOF
}

# Build everything
echo "Building packages…"
yarn build

# Run the tests
echo "Testing…"
yarn test

# Copy the README files in each package directory.
confirm "Generate the README files?"
for pkg_json in ./packages/*/package.json; do
  pkg_name=$(basename "$(dirname "$pkg_json")")
  package_readme "aragon/$pkg_name" > "packages/$pkg_name/README.md"
done

# Publish

publish_message="Publish a version of Connect?"
version_param=""
tag_param=""
if [ -n "${NEW_VERSION-}" ]; then
  publish_message="${publish_message} [version: ${NEW_VERSION}]"
  version_param=" --new-version ${NEW_VERSION}"
fi
if [ -n "${NPM_TAG-}" ]; then
  publish_message="${publish_message} [npm tag:${NPM_TAG}]"
  tag_param=" --publish-tag ${NPM_TAG}"
fi

confirm "$publish_message"
./node_modules/.bin/oao publish --no-check-uncommitted $version_param $tag_param

# Push the version to GitHub
tag="$(git describe --tags "$(git rev-list --tags --max-count=1)")"

confirm "Create a version branch for $tag and push to GitHub?"

echo "Push the master branch…"
git push origin master

echo "Create the $tag branch…"
git checkout -b "$tag" "$tag"

echo "Push the $tag tag…"
git push origin "refs/tags/$tag"

echo "Push the $tag branch…"
git push origin "refs/heads/$tag:refs/heads/$tag"

echo "Done."
