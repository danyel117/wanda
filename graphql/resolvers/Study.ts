import prisma from '@config/prisma';
import { Task } from '@prisma/client';
import { Resolver } from 'types';

const StudyResolvers: Resolver = {
  Query: {},
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
