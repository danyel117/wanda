import { Enum_RoleName, Role } from '@prisma/client';

const roles = [
  {
    name: Enum_RoleName.ADMIN,
  },
  {
    name: Enum_RoleName.EXPERT,
  },
  {
    name: Enum_RoleName.USER,
  },
];

export { roles };
