import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import matchRoles from '@utils/matchRoles';
import { useQuery } from '@apollo/client';
import { GET_STUDIES } from 'graphql/queries/evaluationStudy';
import Loading from '@components/Loading';
import { UserStudy } from 'types';
import PageHeader from '@components/PageHeader';
import { nanoid } from 'nanoid';
import { StudyStatusBadge } from '@components/EvaluationStudyBadge';

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
      <PageHeader title='Design Evaluation Studies'>
        <Link href='/app/design/new'>
          <a>
            <button className='primary' type='button'>
              Create new
            </button>
          </a>
        </Link>
      </PageHeader>
      <div className='my-4 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {data.getUserStudies.map((study: UserStudy) => (
          <StudyCard key={nanoid()} study={study} />
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
    <div className='flex w-full justify-end'>
      <StudyStatusBadge status={study.status} />
    </div>
    <h3 className='w-full text-center font-bold'>{study.name}</h3>
    <div className='flex flex-col items-center'>
      <span className='text-sm text-gray-600'>Research question</span>
      <span className='w-48 text-center text-lg md:w-96'>
        {study.researchQuestion}
      </span>
    </div>
    <div className='flex w-full flex-col items-center'>
      <span className='text-sm text-gray-600'>Site</span>
      <a
        className='external w-full truncate text-center'
        href={study.site}
        title='Go to study site'
        target='_blank'
        rel='noreferrer'
      >
        {study.site}
      </a>
    </div>
    <div className='flex flex-col gap-3 md:flex-row'>
      <Link href={`/app/design/${study.id}`}>
        <button type='button' className='primary'>
          Update Study
        </button>
      </Link>
      <Link href={`/app/sessions?study=${study.id}`}>
        <button
          disabled={study.status === 'DRAFT'}
          type='button'
          className='primary'
        >
          View Sessions
        </button>
      </Link>

      <Link href={`/app/results/${study.id}`}>
        <button
          disabled={study.status === 'DRAFT'}
          type='button'
          className='primary'
        >
          View results
        </button>
      </Link>
    </div>
  </div>
);

export default Studies;
