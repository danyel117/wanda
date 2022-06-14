import prisma from 'config/prisma';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next/types';

const matchRoles = async (context: GetServerSidePropsContext) => {
  let url = context.resolvedUrl.split('?')[0];
  const id: string = <string>context.query.id;

  if (id) {
    url = url.replace(id, '[id]');
  }

  const session: any = await getSession({ req: context.req });
  const currentPage = await prisma.page.findUnique({
    where: { route: url },
  });
  const pages = await prisma.page.findFirst({
    where: {
      AND: {
        route: {
          equals: url,
        },
        roles: {
          some: {
            users: {
              some: {
                id: session?.user?.id,
              },
            },
          },
        },
      },
    },
  });

  return {
    rejected: !pages,
    isPublic: currentPage?.isPublic ?? false,
    page: pages,
  };
};

// const checkRolesServer = (context, roles) =>
//   context?.session?.user?.roles?.filter((r) => roles.includes(r.name)).length > 0;

// export { checkRolesServer };

export default matchRoles;
