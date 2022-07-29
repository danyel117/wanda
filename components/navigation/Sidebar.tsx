import { useSidebar } from 'context/sidebar';
import useActiveRoute from 'hooks/useActiveRoute';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { IconType } from 'react-icons/lib';
import {
  MdAssignment,
  MdBarChart,
  MdClose,
  MdHome,
  MdLightbulbOutline,
  MdPsychology,
} from 'react-icons/md';
import { Notifications, UserProfileNav } from '@components/navigation/Navbar';
import Image from 'next/image';
import logo from 'public/img/logo.png';
import PrivateComponent from '@components/PrivateComponent';
import { Enum_RoleName } from '@prisma/client';

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const sidebarItems = [
    <SidebarItem key={nanoid()} Icon={MdHome} name='Home' href='/app' />,
    <PrivateComponent
      key={nanoid()}
      roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
    >
      <SidebarItem
        Icon={MdAssignment}
        name='Configure Scripts'
        href='/app/scripts'
      />
    </PrivateComponent>,
    <PrivateComponent
      key={nanoid()}
      roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
    >
      <SidebarItem
        Icon={MdLightbulbOutline}
        name='Design Evaluation Studies'
        href='/app/design'
      />
    </PrivateComponent>,
    <PrivateComponent
      key={nanoid()}
      roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
    >
      <SidebarItem
        Icon={MdPsychology}
        name='Conduct Study Sessions'
        href='/app/sessions'
      />
    </PrivateComponent>,
    <PrivateComponent key={nanoid()} roleList={[Enum_RoleName.PARTICIPANT]}>
      <SidebarItem
        Icon={MdPsychology}
        name='Study Sessions'
        href='/app/sessions'
      />
    </PrivateComponent>,
    <PrivateComponent
      key={nanoid()}
      roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}
    >
      <SidebarItem
        Icon={MdBarChart}
        name='Analyse Results'
        href='/app/results'
      />
    </PrivateComponent>,
  ];
  return (
    <>
      {/* Sidebar starts */}
      <aside className='absolute hidden h-screen w-64 bg-gray-900 shadow lg:relative lg:flex lg:w-64 lg:flex-col'>
        <SidebarImage />
        <ul className=' py-6'>{sidebarItems.map((el) => el)}</ul>
      </aside>

      <aside
        className={
          open
            ? 'absolute z-40 h-full w-full  translate-x-0  transform '
            : 'absolute z-40 h-full w-full  -translate-x-full transform'
        }
        id='mobile-nav'
      >
        <div className='absolute z-40 h-full w-64 bg-gray-900 pb-4 shadow transition duration-150 ease-in-out sm:relative lg:hidden'>
          <div className='flex h-full w-full flex-col justify-between'>
            <div>
              <div className='flex items-start justify-between px-8'>
                <SidebarImage />
                <button
                  type='button'
                  id='closeSideBar'
                  className='flex h-10 w-10 items-center justify-center text-2xl hover:text-indigo-300'
                  onClick={() => setOpen(!open)}
                >
                  <MdClose />
                </button>
              </div>
              <ul className=' py-6'>{sidebarItems.map((el) => el)}</ul>
            </div>
            <div className='w-full'>
              <div className='border-t border-gray-300'>
                <div className='flex w-full items-center justify-between px-6 pt-1'>
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

const SidebarImage = () => (
  <Link href='/'>
    <a>
      <div className='p-8'>
        <div>
          <Image src={logo} />
        </div>
      </div>
    </a>
  </Link>
);

interface SidebarItemProps {
  Icon: IconType;
  name: string;
  href: string;
}

const SidebarItem = ({ Icon, name, href }: SidebarItemProps) => {
  const active = useActiveRoute(href);
  return (
    <li className={`sidebar-item ${active && 'sidebar-item-active'} `}>
      <Link href={href}>
        <a>
          <div className='flex items-center'>
            <div className='text-3xl'>
              <Icon />
            </div>
            <span className='ml-2 leading-4'>{name}</span>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default Sidebar;
