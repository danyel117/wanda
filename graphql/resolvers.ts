import { EvaluationSessionResolvers } from 'graphql/resolvers/EvaluationSession';
import { Resolver } from 'types';
import { ScriptResolvers } from 'graphql/resolvers/Script';
import { StudyResolvers } from 'graphql/resolvers/Study';

const customResolvers: Resolver[] = [
  EvaluationSessionResolvers,
  ScriptResolvers,
  StudyResolvers,
];

export { customResolvers };
