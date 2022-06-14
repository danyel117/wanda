import { useState } from 'react';
import LoginModal from '@components/modals/LoginModal';

const LoginButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button className='primary' onClick={() => setOpen(true)}>
        Take me there!
      </button>
      <LoginModal open={open} setOpen={setOpen} />
    </>
  );
};

export { LoginButton };
