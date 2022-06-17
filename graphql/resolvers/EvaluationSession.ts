import prisma from 'config/prisma';
import { EvaluationSession } from '@prisma/client';
import { Resolver } from 'types/types';

const EvaluationSessionResolvers: Resolver = {
  EvaluationSession: {
    latestState: async (parent: EvaluationSession) => {
      const states = await prisma.evaluationSessionState.findMany({
        where: {
          evaluationSessionId: parent.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (states.length > 0) {
        return states[0];
      }

      return null;
    },
  },
  Mutation: {},
  Query: {},
};

export { EvaluationSessionResolvers };
