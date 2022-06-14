import { useSession, signIn } from 'next-auth/react';
import Loading from '@components/Loading';
import PrivateLayout from '@layouts/PrivateLayout';
// import LayoutPublic from '@layouts/LayoutPublic';

interface PrivateRouteProps {
  children: React.ReactNode;
  rejected?: boolean;
  isPublic?: boolean;
}

const PrivateRoute = ({ children, rejected, isPublic }: PrivateRouteProps) => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <Loading />;
  if (isPublic) return <>{children}</>;

  if (!session) {
    signIn('auth0');
    return <Loading />;
  }

  if (isPublic) return <>{children}</>;
  if (!rejected) return <PrivateLayout>{children}</PrivateLayout>;

  return <div>You are not authorized to view this page.</div>;
};

export default PrivateRoute;
