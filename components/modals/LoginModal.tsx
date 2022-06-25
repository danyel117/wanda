import { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import Modal from '@components/modals/Modal';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { signIn } from 'next-auth/react';
import useFormData from 'hooks/useFormData';

interface LoginModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = ({ open, setOpen }: LoginModalProps) => (
  <Modal open={open} setOpen={setOpen} title='Sign in'>
    <div className='flex flex-col gap-4'>
      <span>Select your preferred login method:</span>
      <div className='flex flex-col gap-3 px-10'>
        <LoginButton Icon={FcGoogle} text='Google' provider='google' />
        <LoginButton Icon={FaGithub} text='GitHub' provider='github' />
        <EmailLogin />
      </div>
    </div>
  </Modal>
);

const EmailLogin = () => {
  const { form, formData, updateFormData } = useFormData(null);

  const submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    signIn('email', { email: formData.email, callbackUrl: '/app' });
  };
  return (
    <div className='flex flex-col items-center'>
      <div className='text-gray-300'>------------- or -------------</div>
      <form
        className='flex flex-col justify-center gap-2'
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
      >
        <label htmlFor='email'>
          <span>Login with email</span>
          <input name='email' type='email' placeholder='Email' />
        </label>
        <div className='flex justify-center'>
          <button className='primary' type='submit'>
            Send me a link!
          </button>
        </div>
      </form>
    </div>
  );
};

interface LoginButtonProps {
  Icon: IconType;
  text: string;
  provider: string;
}

const LoginButton = ({ Icon, text, provider }: LoginButtonProps) => (
  <button
    type='button'
    onClick={() => signIn(provider, { callbackUrl: '/app' })}
    className='flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-2 shadow-md hover:border-indigo-500'
  >
    <Icon />
    <span>{text}</span>
  </button>
);

export default LoginModal;
