import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import matchRoles from '@utils/matchRoles';
import { useQuery } from '@apollo/client';
import { GET_STUDIES } from 'graphql/queries/study';
import Loading from '@components/Loading';
import { UserStudy } from 'types';
import { MdPsychology, MdTask } from 'react-icons/md';
import StatCard from '@components/StatCard';
import PageHeader from '@components/PageHeader';

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
const Studies: NextPage = () => {
  const { data, loading } = useQuery(GET_STUDIES, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Loading />;

  return (
    <div className='flex h-full w-full flex-col p-10'>
      <PageHeader title='Study management'>
        <Link href='/app/studies/new'>
          <a>
            <button className='primary' type='button'>
              Create new
            </button>
          </a>
        </Link>
      </PageHeader>
      <div className='my-4 grid grid-cols-2 justify-items-center gap-2'>
        {data.getUserStudies.map((study: UserStudy) => (
          <StudyCard study={study} />
        ))}
      </div>
    </div>
  );
};

interface StudyCardProps {
  study: UserStudy;
}
const StudyCard = ({ study }: StudyCardProps) => (
  <div className='card flex items-center justify-center gap-3'>
    <h3 className='my-3 font-bold'>{study.name}</h3>
    <div className='flex flex-col items-center'>
      <span className='text-sm text-gray-600'>Research question</span>
      <span className='text-lg'>{study.researchQuestion}</span>
    </div>
    <div className='flex flex-col items-center'>
      <span className='text-sm text-gray-600'>Site</span>
      <a
        className='external truncate'
        href={study.site}
        title='Go to study site'
        target='_blank'
        rel='noreferrer'
      >
        {study.site}
      </a>
    </div>
    <div className='flex'>
      <StatCard
        Icon={MdTask}
        link={`/app/studies/${study.id}/tasks`}
        title='Number of tasks'
        stat={study.taskCount.toString()}
      />
      <StatCard
        Icon={MdPsychology}
        link={`/app/evaluations/?study=${study.id}`}
        title='Evaluations completed'
        stat={`${study.evaluationSummary.completed.toString()} out of ${study.evaluationSummary.total.toString()}`}
      />
    </div>
  </div>
);

export default Studies;
