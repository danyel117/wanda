import React, { useState } from 'react';
import matchRoles from '@utils/matchRoles';
import { GetServerSideProps, NextPage } from 'next';
import Modal from '@components/modals/Modal';
import { GET_SCRIPTS } from 'graphql/queries/script';
import Loading from '@components/Loading';
import { Script } from '@prisma/client';
import { ScriptCard } from '@components/Scripts/ScriptCard';
import PageHeader from '@components/PageHeader';
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';

const MutateScript = dynamic(() => import('@components/Scripts/MutateScript'), {
  ssr: false,
});

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

const Scripts: NextPage = () => {
  const [openNew, setOpenNew] = useState<boolean>(false);
  const { data, loading } = useQuery(GET_SCRIPTS, {
    fetchPolicy: 'cache-and-network',
  });
  if (loading) return <Loading />;
  return (
    <>
      <div className='flex h-full w-full flex-col p-4 lg:p-10'>
        <PageHeader title='Script management'>
          <button
            className='primary flex'
            type='button'
            onClick={() => setOpenNew(true)}
          >
            Create new
          </button>
        </PageHeader>

        <div className='grid w-full grid-cols-1 justify-items-center gap-6 p-6 md:grid-cols-3'>
          {data.getScripts?.map((script: Script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      </div>
      <Modal open={openNew} setOpen={setOpenNew} title='New Script'>
        <MutateScript setOpen={setOpenNew} />
      </Modal>
    </>
  );
};

export default Scripts;
