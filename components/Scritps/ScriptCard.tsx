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
  <div className='card w-80'>
    <div className='w-full border-b border-indigo-500 p-2'>
      <div className='flex w-full items-center justify-center'>
        <span className='w-full text-center'>{script?.name ?? ''}</span>
        <div className='flex w-10 justify-end hover:text-indigo-500'>
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
