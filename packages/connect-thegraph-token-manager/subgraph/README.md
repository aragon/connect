# Example subgraph for an Aragon app

Fork this code to create a subgraph that indexes all data in a given network, for a given type of Aragon app, e.g. all voting apps in mainnet.

## What do I need to know to make Aragon app subgraphs?

Making a subgraph for an aragon app is not much different than making a general subgraph. To learn how to do that, check out TheGraphs's docs: https://thegraph.com/docs

In this subgraph template, we merely hook up a bunch of Aragon related data sources that will detect any installed app in the Aragon universe. This is hidden from you so that writting the subgraph is as similar as possible as writting a general subgraph.

## Step by step guide for using this template

1. Fork this repo.
2. Replace all instances of "voting" in package.json with the name of your app.
3. Replace all instances of "ajsantander" in package.json with your github username. This is required by TheGraph, and should match your TheGraph username.
4. Build the manifest file as described in "Setting up the subgraph.yaml manifest" section.
5. Create your mappings as described in "Setting up the app's reducers".
6. Define your entities in schema.graphql as usual.
7. Define your data sources as described in "Defining your data sources".
8. Deploy and test your graph as described in "Deploying and testing your graph".

## Setting up the subgraph.yaml manifest

The way we handle data sources in these subgraphs is a bit sophisticated, so the subgraph.yaml file at the root is actually a generated file and should not be edited.

Instead, edit manifest/subgraph.template.yaml. You'll notice that there's a bunch of mustache tags all over the place. This is stuff that you shouldn't have to worry about. The part that matters to you is the templates section. This is the template that will be used whenever the data sources detect that an instance of your app was created.

## Setting up the app's reducers

In src/mappings/config.ts, you need to define the appId (hash of the ens name of the app, e.g. "voting.aragonpm.eth") and the name of the template you set up in "Setting up the subgraph.yaml manifest". Whenever we detect that an app proxy was created, we check if the proxy's appId matches what you specified, and if it does, we instantiate the data source template that you specified.

To define the reducers for this data source, simply replace src/mappings/Voting.ts with a file as specified in your template's file path in config/manifest/subgraph.template.yaml.

## Defining your data sources

When generating the final subgraph.yaml manifest file, mustache uses the data views specified in manifest/data. Here, we specify 2 files per network. For example, in mainnet.json, we define all the known DAOFactories, and hence catch every single app instantiation. When using these data sources, expect subgraphs to take > 10hs to sync.

In mainnet-staging.json, we only define a single org as a data source. This is ideal for development, since subgraphs take ~1m to sync.

## Deploying and testing your graph

To deploy your subgraph, simply run `yarn deploy`. This will generate the subgraph.yaml file, and deploy the graph. If you want to deploy a staging version, run `yarn deploy-staging` instead. If you want to target a network other than mainnet, use `yarn deploy-<network>` and `yarn deploy-<network>-staging`.

Keep in mind that you need to have a graph created in your TheGraph dashboard, and that its naming must comply with: "Aragon AppName NetworkName [Staging]". For instance, running `yarn deploy-rinkeby-staging` will target the subgraph "your_username/aragon-app_name-rinkeby-staging", named "Aragon AppName Rinkeby Staging".