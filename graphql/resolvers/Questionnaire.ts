import prisma from '@config/prisma';
import { Questionnaire } from '@prisma/client';
import { Resolver } from 'types';

const QuestionnaireResolvers: Resolver = {
  Questionnaire: {
    questions: async (parent: Questionnaire) =>
      await prisma.question.findMany({
        where: {
          questionnaireId: parent.id,
        },
        orderBy: {
          position: 'asc',
        },
      }),
  },
  Query: {
    getStudyQuestionnaire: async (parent, args) =>
      await prisma.questionnaire.findUnique({
        where: {
          evaluationStudyId: args.studyId,
        },
      }),
  },
  Mutation: {},
};

export { QuestionnaireResolvers };
