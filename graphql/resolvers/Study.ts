import prisma from '@config/prisma';
import { Enum_EvaluationSessionStatus, Study, Task } from '@prisma/client';
import { Resolver } from 'types';

const StudyResolvers: Resolver = {
  Study: {
    taskCount: async (parent: Study, args) =>
      await prisma.task.count({
        where: {
          studyId: parent.id,
        },
      }),
    evaluationSummary: async (parent: Study, args) => {
      const evaluationSessions = await prisma.evaluationSession.findMany({
        where: {
          studyId: parent.id,
        },
      });

      const completed = evaluationSessions.filter(
        es => es.status === Enum_EvaluationSessionStatus.COMPLETED
      ).length;

      const total = evaluationSessions.length;
      return {
        pending: total - completed,
        completed,
        total,
      };
    },
  },
  Query: {
    getUserStudies: async (parent, args, context) =>
      await prisma.study.findMany({
        where: {
          userId: {
            equals: context.session?.user.id ?? '',
          },
        },
      }),
  },
  Mutation: {
    createStudyWithTasks: async (parent, args, context) =>
      await prisma.study.create({
        data: {
          id: args.data.study.id,
          name: args.data.study.name,
          site: args.data.study.site,
          researchQuestion: args.data.study.researchQuestion,
          script: {
            connect: {
              id: args.data.study.script.connect.id,
            },
          },
          createdBy: {
            connect: {
              id: context.session.user.id ?? '',
            },
          },
          tasks: {
            createMany: {
              data: args.data.tasks.map((t: Task) => ({
                description: t.description,
                url: t.url,
                id: t.id,
                recording: t.recording,
              })),
            },
          },
        },
      }),
  },
};

export { StudyResolvers };
