# Writing an app Subgraph

Creating a Subgraph for an Aragon app is not much different from any other kind of Subgraph. If you’re not already familiar with what can be done in a Subgraph, we recommend checking out [The Graph’s documentation](https://thegraph.com/docs).

In our app Subgraphs, we merely hook into a number of Aragon related data sources that will detect any installed organization, app, token, etc associated to an Aragon deployment. This is all hidden from you, so writing the Subgraph is as similar as possible to writing a normal Subgraph.

## Step by step guide

To create a new Subgraph for Aragon, start by creating a copy of an existing Subgraph, such as [`connect-thegraph-voting`](https://github.com/aragon/connect/tree/master/packages/connect-thegraph-voting). Then follow the steps below to modify the contents for your needs.

### 1. Modify package.json with your username and Subgraph name

In `package.json`, you’ll find a number of scripts that reference the user "aragon" and the application "voting". Change these to your user \(or Github organization’s name\) and your application’s name.

### 2. Create your Subgraph in The Graph’s explorer dashboard

The scripts in `package.json` will generate your `subgraph.yaml` manifest file and deploy your Subgraph with a very specific nomenclature.

For example, if you run `yarn deploy-mainnet`, you’ll deploy a Subgraph named "Aragon Voting Mainnet". If you run `yarn deploy-mainnet-staging`, you’ll deploy a Subgraph named "Aragon Voting Mainnet Staging". Make sure these Subgraphs are already created in [The Graph’s explorer dashboard](https://thegraph.com/explorer/dashboard).

The specification for the nomenclature is: `Aragon <AppName> <Network> [Staging]`.

Staging Subgraphs are intended for development, as they index very quickly. We’ll expand more on this in [step 8](app-subgraphs.md#8-test-your-subgraph-with-few-data-sources).

### 3. Set up the Subgraph manifest files

The way we handle data sources in these Subgraphs is a bit sophisticated, so the `subgraph.yaml` file at the root is actually a generated file and should not be edited. This is why you may not find this file at the root of the project until it is generated first.

Instead, edit `subgraph.template.yaml`. You will notice that there are a number of [Mustache](https://mustache.github.io) tags in this file. You don't have to worry about this yet! Initially, the only sections you should modify is whatever is not a Mustache tag. You can define static data sources in the `dataSources` section and dynamic data sources in the `templates` section.

If you are writing a Subgraph for an Aragon app, its data source specification should go in the latter, since its instances are be generated dynamically \(as organizations install your app\). As an example, the Voting app's template declares the "Voting" data source template. This data source will be hooked up to any installed instances of Voting found in all deployed Aragon organizations.

If you’d like to disable a specific injected data source, such as the `OrganizationTemplates` data source, you can use an exclamation symbol:

```yaml
{ { !> OrganizationTemplates.yaml } }
```

### 4. Provide the ABIs defined in your data source

As with any Subgraph, ABIs referenced in your manifest should be provided in the `abis` folder.

You may obtain such ABI files from Etherscan or the contract developer.

### 5. Define the Subgraph schema

This is the same as defining a GraphQL schema for any Subgraph. Start with the high level entities, and iterate.

In the case of the example Voting Subgraph, we defined the `Vote` and `Cast` entities. These entities were defined with just an ID, and their properties were added as the Subgraph was developed.

### 6. Define the Subgraph mappings

The data sources defined in `subgraph.template.yaml` reference files in `src` that need to be implemented. In the example Voting Subgraph, you’ll find such definitions in `src/Voting.ts`. These mappings specify what the Subgraph should do whenever a relevant event to a Voting app was detected.

### 7. Hook up your mappings

In `src/aragon-hooks`, you’ll find a series of hooks that can be used to react to specific events that occur in the background of any specific app. For example, you can react to when an organization was first detected by creating an entity that is then used by your Subgraph.

Most importantly, the `getTemplateForApp\(...\)` hook allows you to specify the name of a data source template that you’d like to create when a specific app instance is newly detected. See the example Voting Subgraph's `aragon-hooks` as an example of this applied to instances of the Voting app.

### 8. Test your Subgraph with a few data sources

At this point, you’re ready to take your Subgraph for a spin!

Run any of the deploy commands with `-staging`. This will use data provided from `manifest/data`'s JSON files to determine which data sources to use for indexing the staging version of your Subgraph.

For example, if you run `yarn deploy-mainnet-staging`, `manifest/data/mainnet-staging.json` will be used to generate your Subgraph manifest. This JSON file defines a single data source with the PieDAO organization. The resulting deployment will effectively sync very quickly, which should allow you to iterate on your Subgraph without having to wait for long periods of time before you can start testing.

You need to export your The Graph access token as the `GRAPHKEY` environment variable before running a `deploy-` script.

### 9. Deploy your Subgraph with all data sources

Once you are confident that your Subgraph will behave as expected, you can run `GRAPHKEY=<key> yarn deploy-mainnet` \(without `-staging`!\). This will use `manifest/data/mainnet.json`, which contains many Aragon data sources, such as the templates used by most users to create an organization. This will allow your Subgraph to find all the organizations out there, and as in the example, index all instances of the specified apps.

Of course, this deployment will take much more time to index − potentially days.

## Troubleshooting

### Some data is missing in my Subgraph

Even though the provided templates collect data from many sources, there may still be some cases in which a contract is deployed in a way that isolates it from the general data sources.

For example, you may deploy an organization manually, without using the official templates or factories. If this is the case, the organization will not be detected by our pre-defined data sources.

There may also be bugs in how a template scans the data sources. If you find missing information in your Subgraph, please contact us to discuss your case to see if there’s a bug in the template. If a bug is not the case, you may have to manually insert specific data sources in your Subgraph, such as isolated organizations, apps or, tokens.

### I’m getting errors about missing ABIs when the Subgraph is indexing

When a reducer is run, it’s run in the context of the data source that defined it. For example, hooks are triggered by `src/base/Kernel.ts` when the `NewAppProxy` event is detected in an Organization. You need to include the missing ABI in `manifest/templates/contracts/Kernel.template.yaml` for it to be available in this reducer.

As a rule of thumb, if your data source will be triggered by a base Aragon data source \(organization templates, organization factories, etc\), include its ABI in the `manifest/templates/contracts` files.

### My `callHandlers` aren’t working

Unfortunately, [The Graph does not support callHandlers in Rinkeby](https://thegraph.com/docs/define-a-subgraph#call-handlers). For this reason, our templates avoid them altogether. In general, we prefer to code Subgraphs in a way that is compatible with all networks. Alternatively, if you have no other choice than to use this feature, consider hosting your own Subgraph.
