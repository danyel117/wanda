import prisma from '@config/prisma';
import { Resolver } from 'types';
import { calculateSUS } from 'graphql/resolvers/StudySession';

const EvaluationStudyResultResolvers: Resolver = {
  EvaluationStudyResult: {
    sus: async (parent) => {
      const studySessions = await prisma.studySession.findMany({
        where: {
          studyId: parent.id,
          status: 'COMPLETED',
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
      if (studySessions.length === 0) {
        return 0;
      }
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
            esr."order"::int,
            esr.description,
            EXTRACT(epoch FROM esr.duration) as "duration",
            (cast(esr.completed as decimal) / esr.total) as "successRate"
            from public.evaluationstudyresult esr
        where esr.id = ${args.id};
      `;

      const participantStatus: { [key: string]: number }[] =
        await prisma.$queryRaw`
      select 
      count(*) FILTER (WHERE ss.status = 'COMPLETED')::int AS "completed",
      count(*) FILTER (WHERE ss.status = 'NOT_STARTED')::int AS "notStarted",
      count(*)::int as "total",
      es."participantTarget"::int,
      es."participantTarget"::int - count(*)::int as "missing"
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
