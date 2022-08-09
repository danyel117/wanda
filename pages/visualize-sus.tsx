import matchRoles from '@utils/matchRoles';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import SUS from 'react-system-usability-scale';
import 'react-system-usability-scale/dist/styles/styles.css';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { rejected, isPublic, page } = await matchRoles(ctx);
  return {
    props: {
      rejected,
      isPublic,
      page,
    },
  };
};

const VisualizeSus = () => {
  const [value, setValue] = useState<number>(0);
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-start bg-white p-10'>
      <div className='self-start'>
        <Link href='/'>
          <a>Back to Wanda</a>
        </Link>
      </div>
      <label htmlFor='sus'>
        <span>Enter the SUS value</span>
        <input
          name='sus'
          type='number'
          min={0}
          step={0.1}
          max={100}
          value={value.toString()}
          onChange={(e) => {
            setValue(parseFloat(e.target.value ?? 0));
          }}
        />
      </label>
      <SUS result={value} />
    </div>
  );
};

export default VisualizeSus;
