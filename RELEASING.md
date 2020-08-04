# Releasing a new version of Aragon Connect

## Prepare the release notes

[Create a new draft release](https://github.com/aragon/connect/releases/new) and write the complete changelog for this version. Ideally this should be done before publishing on npm, so that there is no delay between the release on npm and the announcement.

## Check that everything is ready

```console
yarn oao status
```

Here you want to verify the current versions, and that private packages are marked as such so they don’t get published by mistake (especially for the examples).

## Run the publication script

```console
yarn publish-version
```

This script will:

- Build Connect.
- Run the tests.
- Generate the README files.
- Publish the packages on npm.
- Generate a branch corresponding to the version tag.
- Push `master`, the version branch and the version tag to GitHub.

## Manual tasks on GitHub and GitBook

GitBook doesn’t support git tags, this is why a branch corresponding to the version tag gets created by the `publish-version` script. We now need to do two things: protect the branch on GitHub, and reorder the versions menu on GitBook.

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
