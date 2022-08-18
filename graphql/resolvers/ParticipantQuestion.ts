import prisma from '@config/prisma';
import { Resolver } from 'types';

const ParticipantQuestionResolvers: Resolver = {
  Query: {
    getParticipantSessionQuestions: async (parent, args) =>
      await prisma.participantQuestion.findMany({
        where: {
          studySessionId: {
            equals: args.sessionId,
          },
        },
      }),
  },
  Mutation: {},
};

export { ParticipantQuestionResolvers };
