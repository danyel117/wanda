import prisma from '@config/prisma';
import {
  Enum_RoleName,
  Enum_StudySessionStatus,
  EvaluationStudy,
  Question,
  Task,
} from '@prisma/client';
import { checkRolesServer } from '@utils/matchRoles';

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
    getUserStudies: async (parent, args, context) => {
      if (checkRolesServer(context, [Enum_RoleName.ADMIN])) {
        return await prisma.evaluationStudy.findMany({});
      }
      return await prisma.evaluationStudy.findMany({
        where: {
          userId: {
            equals: context.session?.user.id ?? '',
          },
        },
      });
    },
  },
  Mutation: {
    createEvaluationStudyWithTasks: async (parent, args, context) =>
      await prisma.evaluationStudy.create({
        data: {
          id: args.data.evaluationStudy.id,
          name: args.data.evaluationStudy.name,
          site: args.data.evaluationStudy.site,
          participantTarget: parseInt(args.data.evaluationStudy.target, 10),
          researchQuestion: args.data.evaluationStudy.researchQuestion,
          status: args.data.evaluationStudy.status,
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
              data: args.data.tasks.map((t: Task, index: number) => ({
                description: t.description,
                url: t.url,
                id: t.id,
                recording: t.recording,
                order: index + 1,
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
    fullDeleteEvaluationStudy: async (parent, args, context) => {
      const evaluationStudy = await prisma.evaluationStudy.findUnique({
        where: {
          id: args.id,
        },
      });

      if (evaluationStudy?.userId === context.session?.user.id) {
        // delete question responses
        await prisma.questionResponse.deleteMany({
          where: {
            question: {
              questionnaire: {
                evaluationStudyId: {
                  equals: args.id,
                },
              },
            },
          },
        });

        // delete questions
        await prisma.question.deleteMany({
          where: {
            questionnaire: {
              evaluationStudyId: {
                equals: args.id,
              },
            },
          },
        });

        // delete questionnaire
        await prisma.questionnaire.deleteMany({
          where: {
            evaluationStudyId: {
              equals: args.id,
            },
          },
        });

        // delete study session data
        await prisma.studySessionData.deleteMany({
          where: {
            studySession: {
              studyId: {
                equals: args.id,
              },
            },
          },
        });

        // delete study session tasks
        await prisma.studySessionTask.deleteMany({
          where: {
            session: {
              studyId: {
                equals: args.id,
              },
            },
          },
        });

        // delete tasks
        await prisma.task.deleteMany({
          where: {
            studyId: {
              equals: args.id,
            },
          },
        });

        // delete study
        await prisma.evaluationStudy.deleteMany({
          where: {
            id: {
              equals: args.id,
            },
          },
        });

        return {
          result: true,
        };
      }

      return {
        result: false,
      };
    },
  },
};

export { EvaluationStudyResolvers };
