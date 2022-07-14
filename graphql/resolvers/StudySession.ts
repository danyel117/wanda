import prisma from '@config/prisma';
import { StudySession, Task } from '@prisma/client';
import { ExtendedQuestionResponse, Resolver } from 'types';

export const calculateSUS = (questionResponses: ExtendedQuestionResponse[]) => {
  const oddQuestions =
    questionResponses
      .filter((q) => q.question.position % 2 === 1)
      .reduce((prev, current) => prev + (current.responseNumber ?? 0), 0) - 5;

  const evenQuestions =
    25 -
    questionResponses
      .filter((q) => q.question.position % 2 === 0)
      .reduce((prev, current) => prev + (current.responseNumber ?? 0), 0);

  return (oddQuestions + evenQuestions) * 2.5;
};

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
    sus: async (parent: StudySession) => {
      const questionResponses = await prisma.questionResponse.findMany({
        where: {
          studySessionId: parent.id,
          question: {
            sus: { equals: true },
          },
        },
        orderBy: {
          question: {
            position: 'asc',
          },
        },
        include: {
          question: true,
        },
      });

      return calculateSUS(questionResponses);
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
