import Navbar from '@components/navigation/Navbar';
import Sidebar from '@components/navigation/Sidebar';
import { SidebarContext } from 'context/sidebar';
import React, { useMemo, useState } from 'react';

interface PrivateLayoutProps {
  children: JSX.Element | JSX.Element[];
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const sidebarContext = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SidebarContext.Provider value={sidebarContext}>
      <div className='flex-no-wrap flex w-full'>
        <Sidebar />
        <div className='flex w-full flex-col'>
          <Navbar />
          <div className='container mx-auto h-full w-11/12 py-10 md:w-4/5'>
            <main className='h-full w-full'>
              <div className='h-full w-full'>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default PrivateLayout;
