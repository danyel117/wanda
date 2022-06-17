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
    <nav className='flex items-center lg:items-stretch justify-end lg:justify-between bg-white shadow relative z-10 h-14'>
      <div className='hidden lg:flex w-full pr-6 justify-end'>
        <div className='w-1/2 hidden lg:flex'>
          <div className='w-full flex items-center pl-8 justify-end'>
            <Notifications />
            <UserProfileNav />
          </div>
        </div>
      </div>
      <button
        type='button'
        className='text-gray-600 mr-8 visible lg:hidden relative text-3xl'
        onClick={() => setOpen(!open)}
      >
        {!open && <MdMenu />}
      </button>
    </nav>
  );
};

const Notifications = () => (
  <div className='h-full w-20 flex items-center justify-center border-r border-l mx-2'>
    <div className='relative cursor-pointer text-gray-600 text-2xl'>
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
    <button
      type='button'
      className='flex items-center relative cursor-pointer'
      onClick={() => setProfile(!profile)}
    >
      <div className='rounded-full'>
        {profile && (
          <ul className='p-2 w-full border-r bg-white absolute rounded left-0 shadow -mt-[70px] md:mt-16'>
            <li className='flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center'>
              <Link href='/profile'>
                <a>
                  <div className='flex items-center'>
                    <MdPersonOutline />
                    <span className='text-sm ml-2'>My Profile</span>
                  </div>
                </a>
              </Link>
            </li>
            <li className='flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2'>
              <button type='button' onClick={() => logOut()}>
                <div className='flex items-center'>
                  <MdLogout />
                  <span className='text-sm ml-2'>Sign out</span>
                </div>
              </button>
            </li>
          </ul>
        )}
        <div className='relative'>
          <div className='rounded-full h-10 w-10 object-cover'>
            <Image
              layout='fill'
              src='https://tuk-cdn.s3.amazonaws.com/assets/components/sidebar_layout/sl_1.png'
              alt='avatar'
            />
          </div>
          <div className='w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto' />
        </div>
      </div>
      <p className='text-gray-800 text-sm mx-3'>Jane Doe</p>
      <div className='cursor-pointer text-gray-600'>
        {profile ? <MdExpandLess /> : <MdExpandMore />}
      </div>
    </button>
  );
};

export { Notifications, UserProfileNav };

export default Navbar;
