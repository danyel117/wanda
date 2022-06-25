import { Enum_RoleName } from '@prisma/client';

const roles = [
  {
    name: Enum_RoleName.ADMIN,
  },
  {
    name: Enum_RoleName.EXPERT,
  },
  {
    name: Enum_RoleName.PARTICIPANT,
  },
];

export { roles };
