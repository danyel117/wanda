import prisma from '@config/prisma';
import { Enum_RoleName } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next/types';
import { Context } from 'types';

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

const checkRolesServer = (context: Context, roles: Enum_RoleName[]) => {
  if (roles.length > 0 && context.session.user.roles) {
    return (
      context.session.user.roles.filter((r) => roles.includes(r.name)).length >
      0
    );
  }

  return false;
};

export { checkRolesServer };

export default matchRoles;
