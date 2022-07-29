import { Enum_EvaluationStudyStatus } from '@prisma/client';
import { evaluationStudyStatusMapping } from 'types/enumMapping';

const StudyStatusBadge = ({
  status,
}: {
  status: Enum_EvaluationStudyStatus;
}) => (
  <span
    className='rounded-lg px-2 text-sm text-white'
    style={{
      backgroundColor: evaluationStudyStatusMapping[status].color,
    }}
  >
    {evaluationStudyStatusMapping[status].label}
  </span>
);

export { StudyStatusBadge };
