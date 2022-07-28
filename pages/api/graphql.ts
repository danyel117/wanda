import { ApolloServer } from 'apollo-server-micro';
import NextCors from 'nextjs-cors';
import { types } from 'prisma/generated/graphql/types';
import { resolvers } from 'prisma/generated/graphql/resolvers';
import { customTypes } from 'graphql/types';
import { customResolvers } from 'graphql/resolvers';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const Server = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  const session = await getSession({ req });

  if (process.env.NODE_ENV === 'production' && !session) {
    return res.status(401).send({ error: 'unauthorized' });
  }

  const apolloServer = new ApolloServer({
    cache: 'bounded',
    context: () => ({ session, req }),
    typeDefs: [...types, ...customTypes],
    resolvers: [...resolvers, ...customResolvers],
    introspection: true,
  });

  await apolloServer.start();

  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['POST', 'OPTIONS', 'GET', 'HEAD'],
    origin: '*',
    optionsSuccessStatus: 204,
  });

  await Server(req, res);
}
