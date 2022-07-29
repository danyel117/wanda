import { GetServerSideProps, NextPage } from 'next';
import matchRoles from '@utils/matchRoles';
import Image from 'next/image';
import Link from 'next/link';
import PrivateComponent from '@components/PrivateComponent';
import { Enum_RoleName } from '@prisma/client';

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

const AppIndex: NextPage = () => (
  <div className='flex flex-wrap justify-center gap-5 p-10 lg:justify-start'>
    <PrivateComponent roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}>
      <IndexCard
        image='/img/script.jpg'
        title='Configure Scripts'
        description='Create, update or delete the scripts you will use before your
          evaluations.'
        href='/app/scripts'
      />
    </PrivateComponent>
    <PrivateComponent roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}>
      <IndexCard
        image='/img/evaluation.jpg'
        title='Design Evaluations'
        description='Design new evaluation studies, setting up the tasks for the participants.'
        href='/app/design'
      />
    </PrivateComponent>
    <PrivateComponent roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}>
      <IndexCard
        image='/img/dash.jpg'
        title='Conduct Study Sessions'
        description='Recruit Participants and conduct study sessions with them.'
        href='/app/sessions'
      />
    </PrivateComponent>
    <PrivateComponent roleList={[Enum_RoleName.PARTICIPANT]}>
      <IndexCard
        image='/img/dash.jpg'
        title='Study Sessions'
        description='Visualise all the sessions you have been invited to.'
        href='/app/sessions'
      />
    </PrivateComponent>
    <PrivateComponent roleList={[Enum_RoleName.ADMIN, Enum_RoleName.EXPERT]}>
      <IndexCard
        image='/img/results.jpg'
        title='Analyse Results'
        description='Visualise the results of the evaluations and export the data.'
        href='/app/results'
      />
    </PrivateComponent>
  </div>
);

interface IndexCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
}

const IndexCard = ({ image, title, description, href }: IndexCardProps) => (
  <Link href={href}>
    <div className='flex w-full cursor-pointer rounded-lg bg-gray-900 shadow-lg hover:shadow-xl sm:w-96'>
      <div className='relative h-full w-64'>
        <Image
          className='rounded-l-lg'
          alt='card image'
          src={image}
          layout='fill'
          objectFit='cover'
        />
      </div>
      <div className='flex w-full flex-col gap-2 p-4'>
        <span className='text-lg font-semibold text-white'>{title}</span>
        <span className='text-gray-300'>{description}</span>
      </div>
    </div>
  </Link>
);
export default AppIndex;
