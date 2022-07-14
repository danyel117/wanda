import prisma from '@config/prisma';
import { Resolver } from 'types';
import { calculateSUS } from 'graphql/resolvers/StudySession';

const EvaluationStudyResultResolvers: Resolver = {
  EvaluationStudyResult: {
    sus: async (parent) => {
      const studySessions = await prisma.studySession.findMany({
        where: {
          studyId: parent.id,
        },
        include: {
          questionResponses: {
            where: {
              question: {
                sus: true,
              },
            },
            include: {
              question: true,
            },
            orderBy: {
              question: {
                position: 'asc',
              },
            },
          },
        },
      });

      return (
        studySessions.reduce(
          (prev, curr) => prev + calculateSUS(curr.questionResponses),
          0
        ) / studySessions.length
      );
    },
  },
  Query: {
    getEvaluationResults: async (parent, args) => {
      await prisma.$queryRaw`refresh materialized view public.evaluationstudyresult`;
      const taskResults = await prisma.$queryRaw`
        select 
            esr."order",
            esr.description,
            EXTRACT(epoch FROM esr.duration) as "duration",
            (cast(esr.completed as decimal) / esr.total) as "successRate"
            from public.evaluationstudyresult esr
        where esr.id = ${args.id};
      `;

      const participantStatus: any = await prisma.$queryRaw`
      select 
      count(*) FILTER (WHERE ss.status = 'COMPLETED') AS "completed",
      count(*) FILTER (WHERE ss.status = 'NOT_STARTED') AS "notStarted",
      count(*) as "total",
      es."participantTarget",
      es."participantTarget" - count(*) as "missing"
      from "EvaluationStudy" es 
        left join "StudySession" ss
          on ss."studyId" = es.id
      where es.id = ${args.id}
      group by es.id
      `;

      return {
        id: args.id,
        taskResults,
        participantStatus: participantStatus[0],
      };
    },
  },
  Mutation: {},
};

export { EvaluationStudyResultResolvers };
