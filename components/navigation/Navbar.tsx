import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useSidebar } from 'context/sidebar';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  MdExpandLess,
  MdExpandMore,
  MdLogout,
  MdMenu,
  MdOutlineNotifications,
  MdPersonOutline,
} from 'react-icons/md';

const Navbar = () => {
  const { open, setOpen } = useSidebar();

  return (
    <nav className='relative z-10 flex h-14 items-center justify-end bg-gray-900 shadow lg:items-stretch lg:justify-between'>
      <div className='hidden w-full justify-end pr-6 lg:flex'>
        <div className='hidden w-1/2 lg:flex'>
          <div className='flex w-full items-center justify-end pl-8'>
            <Notifications />
            <UserProfileNav />
          </div>
        </div>
      </div>
      <button
        type='button'
        className='visible relative mr-8 text-3xl text-gray-600 lg:hidden'
        onClick={() => setOpen(!open)}
      >
        {!open && <MdMenu />}
      </button>
    </nav>
  );
};

const Notifications = () => (
  <div className='mx-2 flex h-full w-20 items-center justify-center border-r border-l'>
    <div className='relative cursor-pointer text-2xl text-white'>
      <MdOutlineNotifications />
    </div>
  </div>
);

const UserProfileNav = () => {
  const router = useRouter();

  const logOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    router.push(data.url);
  };
  const [profile, setProfile] = useState<boolean>(false);
  return (
    <ClickAwayListener onClickAway={() => setProfile(!profile)}>
      <button
        type='button'
        className='relative flex cursor-pointer items-center'
        onClick={() => setProfile(!profile)}
      >
        <div className='rounded-full'>
          {profile && (
            <ul className='absolute left-0 -mt-[70px] w-full rounded border-r bg-gray-900 p-2 shadow md:mt-16'>
              <li className='flex w-full cursor-pointer items-center justify-between text-white hover:text-indigo-300'>
                <Link href='/profile'>
                  <a>
                    <div className='flex items-center'>
                      <MdPersonOutline />
                      <span className='ml-2 text-sm'>My Profile</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li className='mt-2 flex w-full cursor-pointer items-center justify-between text-white hover:text-indigo-300'>
                <button type='button' onClick={() => logOut()}>
                  <div className='flex items-center'>
                    <MdLogout />
                    <span className='ml-2 text-sm'>Sign out</span>
                  </div>
                </button>
              </li>
            </ul>
          )}
          <div className='relative'>
            <div className='h-10 w-10 rounded-full object-cover'>
              <Image
                layout='fill'
                src='https://tuk-cdn.s3.amazonaws.com/assets/components/sidebar_layout/sl_1.png'
                alt='avatar'
              />
            </div>
            <div className='absolute inset-0 m-auto mb-0 mr-0 h-2 w-2 rounded-full border border-white bg-green-400' />
          </div>
        </div>
        <p className='mx-3 text-sm text-white'>Jane Doe</p>
        <div className='cursor-pointer text-white'>
          {profile ? <MdExpandLess /> : <MdExpandMore />}
        </div>
      </button>
    </ClickAwayListener>
  );
};

export { Notifications, UserProfileNav };

export default Navbar;
