import { Tooltip } from '@mui/material';

interface OverFlownTextWithTooltipProps {
  message: string;
}

const OverFlownTextWithTooltip = ({
  message,
}: OverFlownTextWithTooltipProps) => (
  <Tooltip title={message}>
    <div className='flex w-full justify-center'>
      <span className='block truncate w-60'>{message}</span>
    </div>
  </Tooltip>
);

export default OverFlownTextWithTooltip;
