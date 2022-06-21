import { Tooltip } from '@mui/material';
import { Script } from '@prisma/client';
import { BsThreeDotsVertical } from 'react-icons/bs';
import dynamic from 'next/dynamic';

interface ScriptCardProps {
  script: Script | null;
}

const MarkdownRenderer = dynamic(
  () => import('@components/RichText/MarkdownRenderer'),
  {
    ssr: false,
  }
);

const ScriptCard = ({ script }: ScriptCardProps) => (
  <div className='w-80 flex flex-col gap-2 items-center shadow-md bg-gray-50 p-4 rounded-lg'>
    <div className='border-b p-2 border-indigo-500 w-full'>
      <div className='flex w-full justify-center items-center'>
        <span className='w-full text-center'>{script?.name ?? ''}</span>
        <div className='w-10 flex justify-end hover:text-indigo-500'>
          <Tooltip title='Manage script'>
            <button type='button'>
              <BsThreeDotsVertical />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
    <div className='h-80 overflow-y-auto p-2'>
      <MarkdownRenderer md={script?.script ?? ''} />
    </div>
    {script?.recording && <audio src={script.recording} controls />}
  </div>
);

export { ScriptCard };
