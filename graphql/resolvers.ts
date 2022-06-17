import { EvaluationSessionResolvers } from 'graphql/resolvers/EvaluationSession';
import { Resolver } from 'types';
import { ScriptResolvers } from 'graphql/resolvers/Script';

const customResolvers: Resolver[] = [
  EvaluationSessionResolvers,
  ScriptResolvers,
];

export { customResolvers };
