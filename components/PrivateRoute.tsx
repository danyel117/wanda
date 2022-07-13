import { signOut, useSession } from 'next-auth/react';
import Loading from '@components/Loading';
import PrivateLayout from '@layouts/PrivateLayout';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import { NoRoleWelcome } from '@components/NoRoleWelcome';
// import LayoutPublic from '@layouts/LayoutPublic';

interface PrivateRouteProps {
  children: JSX.Element;
  rejected?: boolean;
  isPublic?: boolean;
}

const PrivateRoute = ({ children, rejected, isPublic }: PrivateRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loading />;
  if (isPublic) return children;

  if (!session) {
    router.push('/');
    return null;
  }

  if (!rejected) return <PrivateLayout>{children}</PrivateLayout>;

  if (session.user.roles?.length === 0) {
    return <NoRoleWelcome />;
  }
  return (
    <div>
      You are not authorized to view this page.
      <button
        type='button'
        onClick={() => {
          signOut();
        }}
      >
        <a className='border-b-2 border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700'>
          Take me home
        </a>
      </button>
    </div>
  );
};

export default PrivateRoute;
