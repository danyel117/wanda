import { EvaluationSessionResolvers } from 'graphql/resolvers/EvaluationSession';
import { Resolver } from 'types/types';

const customResolvers: Resolver[] = [EvaluationSessionResolvers];

export { customResolvers };
