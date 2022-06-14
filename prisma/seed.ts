/* eslint-disable no-console */
/* eslint-disable no-restricted-imports */
/* eslint-disable import/extensions */

import { roles } from './seeding/role';
import { pages } from './seeding/page';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // create role
  await Promise.all(
    roles.map(async (r: any) => {
      await prisma.role.upsert({
        where: {
          name: r.name,
        },
        create: {
          name: r.name,
        },
        update: {
          name: r.name,
        },
      });
    })
  );

  // create pages
  await prisma.page.deleteMany({});
  await Promise.all(
    pages.map(async (pg: any) => {
      await prisma.page.upsert({
        where: {
          name: pg.name,
        },
        create: {
          name: pg.name,
          route: pg.route,
          roles: {
            connect: pg.roles.map((r: any) => ({ name: r as any })),
          },
          isPublic: pg.isPublic,
        },
        update: {
          name: pg.name,
          route: pg.route,
          roles: {
            connect: pg.roles.map((r: any) => ({ name: r as any })),
          },
          isPublic: pg.isPublic,
        },
      });
    })
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
