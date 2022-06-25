import prisma from '@config/prisma';
import { EvaluationSession, Task } from '@prisma/client';
import { Resolver } from 'types';

const EvaluationSessionResolvers: Resolver = {
  EvaluationSession: {
    taskList: async (parent: EvaluationSession) => {
      const tasks = await prisma.evaluationTask.findMany({
        where: {
          evaluationSessionId: parent.id,
        },
        orderBy: {
          task: {
            order: 'asc',
          },
        },
      });

      return tasks;
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
      const study = await prisma.study.findUnique({
        where: {
          id: args.data.study.connect.id,
        },
        include: {
          tasks: true,
        },
      });
      await prisma.evaluationSession.create({
        data: {
          expert: {
            connect: {
              email: context.session.user.email ?? '',
            },
          },
          study: {
            connect: {
              id: study?.id ?? '',
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
          data: {
            create: {
              currentTask: 0,
            },
          },
          tasks: {
            createMany: {
              data: study?.tasks?.map((t: Task) => ({ taskId: t.id })) ?? [],
            },
          },
        },
      });
    },
  },
};

export { EvaluationSessionResolvers };
