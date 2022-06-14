import { Dispatch, SetStateAction } from 'react';
import Modal from '@components/modals/Modal';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { signIn } from 'next-auth/react';

interface LoginModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = ({ open, setOpen }: LoginModalProps) => {
  return (
    <Modal open={open} setOpen={setOpen} title='Sign in'>
      <div className='flex flex-col gap-4'>
        <span>Select your preferred login method:</span>
        <div className='px-10 flex flex-col gap-3'>
          <LoginButton Icon={FcGoogle} text='Google' provider='google' />
          <LoginButton Icon={FaGithub} text='GitHub' provider='google' />
        </div>
      </div>
    </Modal>
  );
};

interface LoginButtonProps {
  Icon: IconType;
  text: string;
  provider: string;
}

const LoginButton = ({ Icon, text, provider }: LoginButtonProps) => {
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl: '/app' })}
      className='flex justify-center items-center gap-2 border-2 p-2 rounded-lg shadow-md cursor-pointer hover:border-indigo-500'
    >
      <Icon />
      <span>{text}</span>
    </button>
  );
};

export default LoginModal;
