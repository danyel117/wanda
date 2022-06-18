import { GetServerSideProps, NextPage } from 'next';
import matchRoles from 'utils/matchRoles';

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
const Studies: NextPage = () => {
  return <div>studies</div>;
};

export default Studies;
