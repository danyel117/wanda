import { GetServerSideProps, NextPage } from 'next';
import matchRoles from 'utils/matchRoles';

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

const AppIndex: NextPage = () => {
  return <div>Wanda Internal panel. Expect more things here soon 😎</div>;
};

export default AppIndex;
