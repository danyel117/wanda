import prisma from '@config/prisma';
import { StudySession, Task } from '@prisma/client';
import { Resolver } from 'types';

const StudySessionResolvers: Resolver = {
  StudySession: {
    taskList: async (parent: StudySession) => {
      const tasks = await prisma.studySessionTask.findMany({
        where: {
          studySessionId: parent.id,
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
    getUserStudySessions: async (parent, args, context) =>
      await prisma.studySession.findMany({
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
    createStudySessionNoUser: async (parent, args, context) => {
      const study = await prisma.evaluationStudy.findUnique({
        where: {
          id: args.data.evaluationStudy.connect.id,
        },
        include: {
          tasks: true,
        },
      });
      await prisma.studySession.create({
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

export { StudySessionResolvers };
