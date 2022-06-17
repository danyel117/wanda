interface ResolverFunction {
  [key: string]: (parent: any, args: any, context: any, info: any) => any;
}

export interface Resolver {
  Query: ResolverFunction;
  Mutation: ResolverFunction;
  [key: string]: ResolverFunction;
}
