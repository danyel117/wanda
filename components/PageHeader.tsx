import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
}

const PageHeader = ({ title, children }: PageHeaderProps) => (
  <div className='flex w-full'>
    <h1 className='w-full text-center'>{title}</h1>
    <div className='flex justify-center whitespace-nowrap'>{children}</div>
  </div>
);

export default PageHeader;
