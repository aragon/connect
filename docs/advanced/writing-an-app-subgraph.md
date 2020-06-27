# Aragon app subgraph

Making a subgraph for an aragon app is not much different from making any other kind of subgraph. To learn how to do that, check out TheGraphs's docs: [https://thegraph.com/docs](https://thegraph.com/docs)

In this subgraph template, we merely hook up a bunch of Aragon related data sources that will detect any installed organization, app, token, etc in Aragon deployments. This is hidden from you, so that writting the subgraph is as similar as possible as writting a normal subgraph.

## Step by step guide for using this template

The template is initially set up to connect to all Aragon voting apps. Next, you'll find instructions for how to modify it to index information for another Aragon app, or any specific needs you may have.

### 1. Modify package.json with your username and subgraph name

In "package.json", you'll find a bunch of scripts that reference the user "ajsantander" and the app name "voting". Change these to your user or Github organization name.

### 2. Create your subgraphs in the TheGraph dashboard

The scripts in "package.json" will generate your "subgraph.yaml" manifest file and deploy your subgraph with a very specific nomenclature. For example, if you run `yarn deploy-mainnet`, you'll be deploying to a subgraph named "Aragon Voting Mainnet". If you run `yarn deploy-mainnet-staging`, you'll be deploying to a subgraph named "Aragon Voting Mainnet Staging". Make sure these subgraphs are created in your dashboard.

The specification for the nomenclature is: `Aragon <AppName> <Network> [Staging]`.

Staging subgraphs are intended for development, and are subgraphs that index very quickly. More info on this below.

### 3. Set up the subgraph manifest files

The way we handle data sources in these subgraphs is a bit sophisticated, so the "subgraph.yaml" file at the root is actually a generated file and should not be edited. This is why you may not find this file at the root of the project until it is generated first.

Instead, edit "subgraph.template.yaml". You'll notice that there are a bunch of [Mustache](https://mustache.github.io) tags in this file. This is stuff that you shouldn't have to worry about. Initially, the part that matters to you is whatever is not a mustache tag. Here, you can define static data sources in the "dataSources" section, and dynamic datasources in the "templates" section.

If your writting a subgraph for an Aragon app, its data source specification should go in the latter, since it's instances will be generated dynamically. As an example, this template declares the "Voting" data source template. This data source will be hooked up to any instances of voting apps found in all deployed Aragon organizations.

If you'd like to disable a specific injected data source, such as for example the OrganizationTemplates data sources, you may do so by using an exclamation symbol:

```yaml
{ { !> OrganizationTemplates.yaml } }
```

### 4. Provide the ABIs defined in your data source

As with an TheGraph subgraph, ABIs referenced in your manifest should be provided in the "abis" folder.

You may obtain such ABI files using etherscan. Simply find the address of an instance of what you're looking for using an Aragon subgraph such as [https://thegraph.com/explorer/subgraph/aragon/aragon-mainnet](https://thegraph.com/explorer/subgraph/aragon/aragon-mainnet), and search for that address in Etherscan. Since all Aragon deployments are verified, you should be able to see the contract code an ABI, then copy it for usage in your subgraph code.

### 5. Define the subgraph schema

This is not different from defining schema for any TheGraph or GraphQL subgraph. Simply start with high level entities that you think your subgraph should generate, and iterate.

In the case of the example voting app, we're defining the Vote and Cast entities. The entities are usually defined with just an ID, and its properties are added as the subgraph is developed.

### 6. Define the subgraph mappings

The data sources defined in "subgraph.template.yaml" reference mapping files in "src" that need to be implemented. In this example, you'll find such definitions in "src/Voting.ts". These mappings specify what the subgraph should do whenever a voting app that has been detected triggers an event.

### 7. Hook up your mappings

In "src/aragon-hooks", you'll find a series of hooks that you can use to react to specific events that occur behind the scenes in the templates data source management. For example, you can react to when an organization was detected by creating some entity that you may require on your subgraph.

Most importantly, the "getTemplateForApp\(...\)" hook allows you to specify the name of a data source template that you'd like to create for a given detected app proxy. See the example provided in "aragon-hooks", for how to create templates only for voting apps.

### 8. Test your subgraph with few data sources

At this point, you're ready to take your subgraph for a spin. For this, run any of the deploy commands with "-staging". This will use data which you can provide in the json files in "manifest/data" to determine which data sources to use when indexing your subgraph.

For example, if you run `yarn deploy-mainnet-staging`, "manifest/data/mainnet-staging.json" will be used to generate your subgraph manifest. This json file defines a single data source with the PieDAO organization. The resulting deployment will effectively sync very quickly, which should allow you to iterate on your subgraph without having to wait for long periods of time before you find an error in the subgraph.

### 9. Deploy your subgraph with all data sources

Once you are confident that your subgraph will behave as expected, you may run `yarn deploy-mainnet` \(without "-staging"\). This will use "manifest/data/mainnet.json", which contains many Aragon data sources, such as the templates used when creating an organization. This will allow your subgraph to find all the organizations out there, and as in the example, index all voting apps.

Of course, this deployment will take much more time to index, potentially days.

## Troubleshooting

* Some data is missing in my subgraph Even though the way in which this template collects many data sources, there are some cases in which a contract is deployed in a way that isolates it from the general data sources. For example, you may deploy an organization manually, without using the official templates or factories. If this is the case, such organization will not be detected by the bootstrapped data sources. Also, there may be a bug in which this template scans the data sources. If you find missing information in your subgraph, lets discuss your case to see if there's a bug in the template. If a bug is not the case, you may have to manually insert specific data sources in the subgraph, such as isolated organizations, apps or tokens.
* I'm getting errors about missing ABIs when the subgraph is indexing When a reducer is run, it's run in the context of the data source that defined it. For example, hooks are triggered by src/base/Kernel.ts when the NewAppProxy event is detected in an Organization. You need to include the missing ABI in manifest/templates/Kernel.template.yaml for it to be available in this reducer.
* My callHandlers aren't working Unfortunately, TheGraph does not support callHandlers in Rinkeby. For this reason, this template avoids them altoghether. In general, we prefer to code subgraphs in a way that is compatible with all networks. Alternatively, if you by all means need to use this feature, consider hosting your own subgraph.

