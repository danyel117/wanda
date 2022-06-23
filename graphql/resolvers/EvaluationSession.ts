import prisma from '@config/prisma';
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
  Query: {},
  Mutation: {
    createEvaluationSessionNoUser: async (parent, args, context) => {
      await prisma.evaluationSession.create({
        data: {
          expert: {
            connect: {
              email: context.session.user.email ?? '',
            },
          },
          study: {
            connect: {
              id: args.study.connect.id,
            },
          },
          status: 'NOT_STARTED',
          user: {
            connectOrCreate: {
              where: {
                email: args.participantEmail,
              },
              create: {
                email: args.participantEmail,
              },
            },
          },
        },
      });
    },
  },
};

export { EvaluationSessionResolvers };
