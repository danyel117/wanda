import prisma from 'config/prisma';
import { EvaluationSession } from '@prisma/client';
import { Resolver } from 'types';

const EvaluationSessionResolvers: Resolver = {
  EvaluationSession: {
    latestState: async (parent: EvaluationSession) => {
      const statuses = await prisma.evaluationTaskStatus.findMany({
        where: {
          evaluationSessionId: parent.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (statuses.length > 0) {
        return statuses[0];
      }

      return null;
    },
  },
  Mutation: {},
  Query: {},
};

export { EvaluationSessionResolvers };
