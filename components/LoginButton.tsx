import { useState } from 'react';
import LoginModal from '@components/modals/LoginModal';
import { useSession } from 'next-auth/react';
import Loading from '@components/Loading';
import Link from 'next/link';

const LoginButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();

  if (status === 'loading') return <Loading />;

  if (session) {
    return (
      <Link href='/app'>
        <button type='button' className='primary'>
          Take me there!
        </button>
      </Link>
    );
  }

  return (
    <>
      <button type='button' className='primary' onClick={() => setOpen(true)}>
        Take me there!
      </button>
      <LoginModal open={open} setOpen={setOpen} />
    </>
  );
};

export { LoginButton };
