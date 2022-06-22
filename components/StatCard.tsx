import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
  Icon: IconType;
  link: string;
  title: string;
  stat: string;
}

const StatCard = ({ Icon, link, title, stat }: StatCardProps) => (
  <div className='flex flex-col shadow-md rounded-lg m-2 w-64'>
    <div className='bg-white flex items-center justify-start p-4 rounded-t-lg'>
      <div className='text-indigo-700 text-start'>
        <Icon size='3rem' />
      </div>
      <div className='flex flex-col mx-2'>
        <span className='text-gray-600 text-md'>{title}</span>
        <span className='text-xl font-bold'>{stat}</span>
      </div>
    </div>
    <div className='bg-gray-200 p-4 rounded-b-lg'>
      <Link href={link}>
        <a>
          <span className='text-indigo-700 hover:text-indigo-400'>
            View all
          </span>
        </a>
      </Link>
    </div>
  </div>
);

export default StatCard;
