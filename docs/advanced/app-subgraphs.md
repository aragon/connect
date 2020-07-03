# Writing an App Subgraph

Making a Subgraph for an aragon app is not much different from making any other kind of Subgraph. To learn how to do that, check out [the documentation for The Graph](https://thegraph.com/docs).

In our app Subgraphs, we merely hook up a bunch of Aragon related data sources that will detect any installed organization, app, token, etc in Aragon deployments. This is hidden from you, so that writing the Subgraph is as similar as possible as writing a normal Subgraph.

## Step by step guide for using this guide

To create a new Subgraph for Aragon, start off by creating a copy of one of our existing connectors, such as [`connect-thegraph-voting`](https://github.com/aragon/connect/tree/master/packages/connect-thegraph-voting). Then follow the steps below for modifying them to fit your needs.

### 1. Modify package.json with your username and Subgraph name

In `package.json`, you’ll find a bunch of scripts that reference the user "aragon" and the application "voting". Change these to your user or Github organization’s name, and your application’s name.

### 2. Create your Subgraphs in the dashboard of The Graph

The scripts in `package.json` will generate your `subgraph.yaml` manifest file and deploy your Subgraph with a very specific nomenclature. For example, if you run `yarn deploy-mainnet`, you’ll be deploying to a Subgraph named "Aragon Voting Mainnet". If you run `yarn deploy-mainnet-staging`, you’ll be deploying to a Subgraph named "Aragon Voting Mainnet Staging". Make sure these Subgraphs are created in your dashboard.

The specification for the nomenclature is: `Aragon <AppName> <Network> [Staging]`.

Staging Subgraphs are intended for development, and are Subgraphs that index very quickly. More info on this below.

### 3. Set up the Subgraph manifest files

The way we handle data sources in these Subgraphs is a bit sophisticated, so the `subgraph.yaml` file at the root is actually a generated file and should not be edited. This is why you may not find this file at the root of the project until it is generated first.

Instead, edit `subgraph.template.yaml`. You’ll notice that there are a bunch of [Mustache](https://mustache.github.io) tags in this file. This is stuff that you shouldn’t have to worry about. Initially, the part that matters to you is whatever is not a mustache tag. Here, you can define static data sources in the `dataSources` section, and dynamic datasources in the `templates` section.

If your writing a Subgraph for an Aragon app, its data source specification should go in the latter, since it’s instances will be generated dynamically. As an example, this template declares the "Voting" data source template. This data source will be hooked up to any instances of voting apps found in all deployed Aragon organizations.

If you’d like to disable a specific injected data source, such as for example the OrganizationTemplates data sources, you may do so by using an exclamation symbol:

```yaml
{ { !> OrganizationTemplates.yaml } }
```

### 4. Provide the ABIs defined in your data source

As with any The Graph Subgraph, ABIs referenced in your manifest should be provided in the `abis` folder.

You may obtain such ABI files using etherscan. Simply find the address of an instance of what you’re looking for using an Aragon Subgraph such as [https://thegraph.com/explorer/subgraph/aragon/aragon-mainnet](https://thegraph.com/explorer/subgraph/aragon/aragon-mainnet), and search for that address in Etherscan. Since all Aragon deployments are verified, you should be able to see the contract code an ABI, then copy it for usage in your Subgraph code.

### 5. Define the Subgraph schema

This is not different from defining a schema for any Subgraph. Start with high level entities that you think your Subgraph should generate, and iterate.

In the case of the example voting app, we’re defining the Vote and Cast entities. The entities are usually defined with just an ID, and its properties are added as the Subgraph is developed.

### 6. Define the Subgraph mappings

The data sources defined in `subgraph.template.yaml` reference mapping files in `src` that need to be implemented. In this example, you’ll find such definitions in `src/Voting.ts`. These mappings specify what the Subgraph should do whenever a voting app that has been detected triggers an event.

### 7. Hook up your mappings

In `src/aragon-hooks`, you’ll find a series of hooks that you can use to react to specific events that occur behind the scenes in the templates data source management. For example, you can react to when an organization was detected by creating some entity that you may require on your Subgraph.

Most importantly, the `getTemplateForApp\(...\)` hook allows you to specify the name of a data source template that you’d like to create for a given detected app proxy. See the example provided in `aragon-hooks`, for how to create templates only for voting apps.

### 8. Test your Subgraph with few data sources

At this point, you’re ready to take your Subgraph for a spin. For this, run any of the deploy commands with `-staging`. This will use data which you can provide in the json files in `manifest/data` to determine which data sources to use when indexing your Subgraph.

For example, if you run `yarn deploy-mainnet-staging`, `manifest/data/mainnet-staging.json` will be used to generate your Subgraph manifest. This json file defines a single data source with the PieDAO organization. The resulting deployment will effectively sync very quickly, which should allow you to iterate on your Subgraph without having to wait for long periods of time before you find an error in the Subgraph.

### 9. Deploy your Subgraph with all data sources

Once you are confident that your Subgraph will behave as expected, you may run `yarn deploy-mainnet` \(without `-staging`\). This will use `manifest/data/mainnet.json`, which contains many Aragon data sources, such as the templates used when creating an organization. This will allow your Subgraph to find all the organizations out there, and as in the example, index all voting apps.

Of course, this deployment will take much more time to index, potentially days.

## Troubleshooting

### Some data is missing in my Subgraph

Even though templates collect data from many sources, there are some cases in which a contract is deployed in a way that isolates it from the general data sources. For example, you may deploy an organization manually, without using the official templates or factories. If this is the case, such organization will not be detected by the bootstrapped data sources. There may also be bugs in how a template scans the data sources. If you find missing information in your Subgraph, please contact us to discuss your case to see if there’s a bug in the template. If a bug is not the case, you may have to manually insert specific data sources in the Subgraph, such as isolated organizations, apps or tokens.

### I’m getting errors about missing ABIs when the Subgraph is indexing

When a reducer is run, it’s run in the context of the data source that defined it. For example, hooks are triggered by `src/base/Kernel.ts` when the `NewAppProxy` event is detected in an Organization. You need to include the missing ABI in `manifest/templates/contracts/Kernel.template.yaml` for it to be available in this reducer. As a rule of thumb, if your data source will be triggered by a base Aragon data source \(Organization templates, Organization factories, etc\), include its ABI in the `manifest/templates/contracts` files.

### My callHandlers aren’t working

Unfortunately, The Graph does not support callHandlers in Rinkeby. For this reason, our templates avoid them altogether. In general, we prefer to code Subgraphs in a way that is compatible with all networks. Alternatively, if you by all means need to use this feature, consider hosting your own Subgraph.

