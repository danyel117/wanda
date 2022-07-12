import prisma from '@config/prisma';
import {
  Enum_StudySessionStatus,
  EvaluationStudy,
  Question,
  Task,
} from '@prisma/client';
import { Resolver } from 'types';

const EvaluationStudyResolvers: Resolver = {
  EvaluationStudy: {
    taskCount: async (parent: EvaluationStudy, args) =>
      await prisma.task.count({
        where: {
          studyId: parent.id,
        },
      }),
    evaluationSummary: async (parent: EvaluationStudy, args) => {
      const studySessions = await prisma.studySession.findMany({
        where: {
          studyId: parent.id,
        },
      });

      const completed = studySessions.filter(
        (es) => es.status === Enum_StudySessionStatus.COMPLETED
      ).length;

      const total = studySessions.length;
      return {
        pending: total - completed,
        completed,
        total,
      };
    },
  },
  Query: {
    getUserStudies: async (parent, args, context) =>
      await prisma.evaluationStudy.findMany({
        where: {
          userId: {
            equals: context.session?.user.id ?? '',
          },
        },
      }),
  },
  Mutation: {
    createEvaluationStudyWithTasks: async (parent, args, context) =>
      await prisma.evaluationStudy.create({
        data: {
          id: args.data.evaluationStudy.id,
          name: args.data.evaluationStudy.name,
          site: args.data.evaluationStudy.site,
          participantTarget: 10,
          researchQuestion: args.data.evaluationStudy.researchQuestion,
          script: {
            connect: {
              id: args.data.evaluationStudy.script.connect.id,
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
          questionnaire: {
            create: {
              questions: {
                createMany: {
                  data: args.data.questions.map((q: Question) => ({
                    question: q.question,
                    position: q.position,
                    sus: q.sus,
                  })),
                },
              },
            },
          },
        },
      }),
  },
};

export { EvaluationStudyResolvers };
