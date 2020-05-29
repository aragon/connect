#!/usr/bin/env bash

# Back up real schema
mv schema.graphql schema.graphql.bak

# Insert query into schema to allow graphqlviz inspect our schema
echo '
directive @entity on OBJECT
directive @derivedFrom(field: String) on FIELD_DEFINITION

scalar BigInt
scalar Bytes

schema {
  query: Query
}

type Query {
  OrgFactory: OrgFactory
  RegistryFactory: RegistryFactory
}
' > schema.graphql

# Copy the rest of the schema
cat schema.graphql.bak >> schema.graphql

# Generate schema diagram
graphqlviz schema.graphql | dot -Tpng -o schema.png

# Overwrite modified schema with backed up version
mv schema.graphql.bak schema.graphql
