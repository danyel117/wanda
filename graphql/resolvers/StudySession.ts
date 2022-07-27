import prisma from '@config/prisma';
import { StudySession, Task } from '@prisma/client';
import { createVerificationRequest } from '@utils/createVerificationRequest';
import { sendInviteEmail } from '@utils/email';

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
        orderBy: {
          createdAt: 'desc',
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
      const session = await prisma.studySession.create({
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
        include: {
          participant: true,
          expert: true,
        },
      });

      await sendParticipantEmail({
        participantEmail: session.participant.email ?? '',
        expertEmail: session.expert.email ?? '',
        sessionId: session.id,
        host: context.req.headers.host ?? '',
        site: study?.site ?? '',
      });
    },
  },
};

interface SendParticipantEmailInterface {
  participantEmail: string;
  sessionId: string;
  site: string;
  expertEmail: string;
  host: string;
}

const sendParticipantEmail = async ({
  participantEmail,
  expertEmail,
  sessionId,
  site,
  host,
}: SendParticipantEmailInterface) => {
  const { token } = await createVerificationRequest({
    email: participantEmail,
  });

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const callbackUrl = encodeURIComponent(
    `${protocol}://${host}/app/sessions/${sessionId}`
  );
  const link = `${protocol}://${host}/api/auth/callback/email?callbackUrl=${callbackUrl}&token=${token}&email=${encodeURIComponent(
    participantEmail
  )}`;
  await sendInviteEmail(participantEmail, site, expertEmail, link);
};

export { StudySessionResolvers };
