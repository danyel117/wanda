import { Enum_EvaluationStudyStatus } from '@prisma/client';

const evaluationStudyStatusMapping = {
  [Enum_EvaluationStudyStatus.DRAFT]: {
    label: 'Draft',
    color: '#f59e0b',
  },
  [Enum_EvaluationStudyStatus.ONGOING]: {
    label: 'Ongoing',
    color: '#3b82f6',
  },
  [Enum_EvaluationStudyStatus.COMPLETED]: {
    label: 'Completed',
    color: '#22c55e',
  },
};

export { evaluationStudyStatusMapping };
