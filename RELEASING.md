# Releasing a new version of Aragon Connect

## Prepare the release notes

[Create a new draft release](https://github.com/aragon/connect/releases/new) and write the complete changelog for this version. Ideally this should be done before publishing on npm, so that there is no delay between the release on npm and the announcement.

## Check that everything is ready

```console
yarn oao status
```

Here you want to verify the current versions, and that private packages are marked as such so they don’t get published by mistake (especially for the examples).

## Build Connect

```console
yarn build
```

Ensure the build is working and there are no errors.

## Launch the tests

```console
yarn test
```

## Publish on npm

Note that we are using a direct path to oao because of a [known issue](https://github.com/guigrpa/oao#oao-publish) when running it through yarn script.

```console
./node_modules/.bin/oao publish
```

Push the version to GitHub:

```console
git push origin master
git push origin --tags
```

## Publish the documentation on GitBook

GitBook doesn’t support git tags, so we need to create a new branch for each version. We also protect this branch, to prevent any accidental deletion.

Create and push the branch (using `v.0.5.0` as an example):

```console
git checkout -b v0.5.0 v0.5.0
git push origin refs/heads/v0.5.0:refs/heads/v0.5.0
```

Protect the branch on GitHub:

- Open [the branch settings](https://github.com/aragon/connect/settings/branches) on GitHub.
- Click on the “Add rule” button.
- Put the exact branch name in “Branch name pattern”.
- Click on the “Create” button.

Reorder the menu in GitBook:

- Go to [the GitBook admin page](https://app.gitbook.com/@aragon-one/s/connect/).
- Open the versions menu (it should be on “latest” by default).
- Drag and drop the new version so that it is right below “latest”.
- Click on the “Save” button, then “Merge”.

## Publish the release on GitHub

Open the draft release, and assign the version tag to it (e.g. `v0.5.0`). Publish!

## Announcement

Announce the release on our usual channels: Discord, Keybase, Twitter, etc.
