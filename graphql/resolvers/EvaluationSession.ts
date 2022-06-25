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
  Query: {
    getUserEvaluations: async (parent, args, context) =>
      await prisma.evaluationSession.findMany({
        where: {
          OR: [
            {
              participantId: {
                equals: context.session.user.id ?? '',
              },
            },
            {
              expertId: {
                equals: context.session.user.id ?? '',
              },
            },
          ],
        },
      }),
  },
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
              id: args.data.study.connect.id,
            },
          },
          status: 'NOT_STARTED',
          participant: {
            connectOrCreate: {
              where: {
                email: args.data.participantEmail,
              },
              create: {
                email: args.data.participantEmail,
                roles: {
                  connect: {
                    name: 'PARTICIPANT',
                  },
                },
              },
            },
          },
        },
      });
    },
  },
};

export { EvaluationSessionResolvers };
