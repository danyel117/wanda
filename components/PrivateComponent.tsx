import { Enum_RoleName } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface PrivateComponentProps {
  roleList: Enum_RoleName[];
  children: JSX.Element;
}

const PrivateComponent = ({ roleList, children }: PrivateComponentProps) => {
  const { data: session } = useSession();
  const roleCheck = session?.user?.roles?.some((role) =>
    roleList.includes(role.name)
  );

  if (roleCheck) {
    return children;
  }

  return null;
};

export default PrivateComponent;
