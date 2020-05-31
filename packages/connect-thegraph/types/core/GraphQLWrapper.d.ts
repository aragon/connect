import { DocumentNode } from 'graphql';
import { ParseFunction, QueryResult } from '../types';
export default class GraphQLWrapper {
    #private;
    constructor(subgraphUrl: string, verbose?: boolean);
    performQuery(query: DocumentNode, args?: any): Promise<QueryResult>;
    parseQueryResult(parser: ParseFunction, result: QueryResult): any;
    private describeQueryResult;
}
//# sourceMappingURL=GraphQLWrapper.d.ts.map