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
  <div className='m-2 flex w-64 flex-col rounded-lg shadow-md'>
    <div className='flex items-center justify-start rounded-t-lg bg-white p-4'>
      <div className='text-start text-indigo-700'>
        <Icon size='3rem' />
      </div>
      <div className='mx-2 flex flex-col'>
        <span className='text-md text-gray-600'>{title}</span>
        <span className='text-xl font-bold'>{stat}</span>
      </div>
    </div>
    <div className='rounded-b-lg bg-gray-200 p-4'>
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
