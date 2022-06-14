import { useSession, signIn } from 'next-auth/react';
import Loading from '@components/Loading';
import PrivateLayout from '@layouts/PrivateLayout';
import Link from 'next/link';
// import LayoutPublic from '@layouts/LayoutPublic';

interface PrivateRouteProps {
  children: React.ReactNode;
  rejected?: boolean;
  isPublic?: boolean;
}

const PrivateRoute = ({ children, rejected, isPublic }: PrivateRouteProps) => {
  const { status } = useSession();

  if (status === 'loading') return <Loading />;
  if (isPublic) return <>{children}</>;

  if (!rejected) return <PrivateLayout>{children}</PrivateLayout>;

  return (
    <div>
      You are not authorized to view this page.{' '}
      <Link href='/'>
        <a className='border-b-2 text-blue-500 border-blue-500 hover:border-blue-700 hover:text-blue-700'>
          Take me home
        </a>
      </Link>
    </div>
  );
};

export default PrivateRoute;
