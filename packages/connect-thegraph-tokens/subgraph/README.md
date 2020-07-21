# Aragon Tokens Subgraph

Universal subgraph, for all Aragon TokenManager apps and MiniMeToken's linked to an app or organization.

## Known Caveats

### Orphaned Tokens

There are cases in which a TokenManager contract is detected by the subgraph before the app has been initialized. This is often the case for TokenManager apps that have been created via the CLI instead of a template. As a consequence, since the app's token is set upon initialization, this means that such TokenManager graph entities will not know their associated tokens (which are deployed and set via `initialize()` in a future block).

This subgraph attempts to mitigate this problem by storing instances of TokenManager with no associated tokens in a singleton OrphanTokenManagers entity. The detection of another TokenManager entity will trigger the sweeping of all orphaned apps to see if they have been initialized and their tokens have been set. If so, they are connected and removed from the cache.

This mechanism requires the instantiation of a separate app "B" for the connection of a previously deployed orphan app "A". If this proves to be insufficient in picking up edge cases, the entry point `processOrphanTokenManagers()` could be moved to a different part of the code, such as when any token is transferred.
