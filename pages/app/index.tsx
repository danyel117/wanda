import { GetServerSideProps, NextPage } from 'next';
import matchRoles from '@utils/matchRoles';
import Image from 'next/image';
import Link from 'next/link';

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

const AppIndex: NextPage = () => (
  <div className='flex p-10 flex-wrap gap-5'>
    <IndexCard
      image='/img/evaluation.jpg'
      title='Study Management'
      description='Define new studies and analyze the data on existing ones.'
      href='/app/studies'
    />
    <IndexCard
      image='/img/script.jpg'
      title='Script Management'
      description='Create, update or delete the scripts you will use before your
          evaluations'
      href='/app/scripts'
    />
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
    <div className='flex bg-gray-900 rounded-lg shadow-lg w-96 cursor-pointer hover:shadow-xl'>
      <div className='w-64 h-full relative'>
        <Image
          className='rounded-l-lg'
          alt='card image'
          src={image}
          layout='fill'
          objectFit='cover'
        />
      </div>
      <div className='w-full flex flex-col p-4 gap-2'>
        <span className='text-white font-semibold text-lg'>{title}</span>
        <span className='text-gray-300'>{description}</span>
      </div>
    </div>
  </Link>
);
export default AppIndex;
