import React from 'react';
import matchRoles from 'utils/matchRoles';
import { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async ctx => {
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
  return <div>Scripts</div>;
};

export default Scripts;
