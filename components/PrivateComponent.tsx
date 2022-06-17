import React from 'react';
import { useSession } from 'next-auth/react';

interface PrivateComponentProps {
  roleList: string[];
  children: JSX.Element;
}

const PrivateComponent = ({ roleList, children }: PrivateComponentProps) => {
  const { data: session } = useSession();
  const roleCheck = roleList
    .map(r => r)
    .filter(ru => session?.user.role?.name === ru);

  if (roleCheck.length === 0) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return children;
};

export default PrivateComponent;
