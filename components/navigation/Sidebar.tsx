import { useSidebar } from 'context/sidebar';
import useActiveRoute from 'hooks/useActiveRoute';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { IconType } from 'react-icons/lib';
import { MdAssignment, MdClose, MdHome } from 'react-icons/md';
import { Notifications, UserProfileNav } from '@components/navigation/Navbar';

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const sidebarItems = [
    <SidebarItem key={nanoid()} Icon={MdHome} name='Dashboard' href='/app' />,
    <SidebarItem
      key={nanoid()}
      Icon={MdAssignment}
      name='Scripts'
      href='/app/scripts'
    />,
  ];
  return (
    <>
      {/* Sidebar starts */}
      <aside className='absolute lg:relative w-64 h-screen shadow bg-gray-100 hidden lg:flex lg:flex-col lg:w-64'>
        <div className='h-16 w-full flex items-center px-8'>ux-wanda</div>
        <ul className=' py-6'>{sidebarItems.map(el => el)}</ul>
      </aside>

      <aside
        className={
          open
            ? 'w-full h-full absolute z-40  transform  translate-x-0 '
            : '   w-full h-full absolute z-40  transform -translate-x-full'
        }
        id='mobile-nav'
      >
        <div className='absolute z-40 sm:relative w-64 md:w-96 shadow pb-4 bg-gray-100 lg:hidden transition duration-150 ease-in-out h-full'>
          <div className='flex flex-col justify-between h-full w-full'>
            <div>
              <div className='flex items-center justify-between px-8'>
                <div className='h-16 w-full flex items-center'>ux-wanda</div>
                <button
                  type='button'
                  id='closeSideBar'
                  className='flex items-center justify-center h-10 w-10'
                  onClick={() => setOpen(!open)}
                >
                  <MdClose />
                </button>
              </div>
              <ul className=' py-6'>{sidebarItems.map(el => el)}</ul>
            </div>
            <div className='w-full'>
              <div className='border-t border-gray-300'>
                <div className='w-full flex items-center justify-between px-6 pt-1'>
                  <UserProfileNav />
                  <Notifications />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

interface SidebarItemProps {
  Icon: IconType;
  name: string;
  href: string;
}

const SidebarItem = ({ Icon, name, href }: SidebarItemProps) => {
  const active = useActiveRoute(href);
  return (
    <li
      className={`pl-6 cursor-pointer text-sm leading-3 tracking-normal pb-4 pt-5 ${active &&
        'text-indigo-700 focus:text-indigo-700'} focus:outline-none`}
    >
      <Link href={href}>
        <a>
          <div className='flex items-center'>
            <div className='text-3xl'>
              <Icon />
            </div>
            <span className='ml-2'>{name}</span>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default Sidebar;
