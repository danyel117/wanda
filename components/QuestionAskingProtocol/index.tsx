import { useMutation, useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import { Tooltip } from '@mui/material';
import {
  Enum_QuestionAskingProtocolCategory,
  Enum_QuestionAskingProtocolType,
  ParticipantQuestion,
} from '@prisma/client';
import { CREATE_PARTICIPANT_QUESTION } from 'graphql/mutations/participantQuestion';
import { GET_SESSION_QUESTIONS } from 'graphql/queries/participantQuestion';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';

const QAPHierarchy: Record<string, Record<string, string>> = {
  TARGET: {
    STATE:
      'The user queries about something that is currently happening on the screen',
    GOAL: 'The user queries about what they should be doing at a specific moment',
    MEANS:
      'The user queries how they should be executing the task at a specific moment',
    EFFECT:
      'The user queries what happens if they interact with any element on the screen',
  },
  INTENT: {
    EXPLORATORY: `The user's query seeks for something to start with and does not state any hypothesis`,
    CONFIRMATORY: `The user's query states hypothesis or beliefs and seeks for the expert's approval`,
  },
};

interface TypeMapper {
  [key: string]: Enum_QuestionAskingProtocolType;
}

interface CategoryMapper {
  [key: string]: Enum_QuestionAskingProtocolCategory;
}

const typeMapper: TypeMapper = {
  TARGET: Enum_QuestionAskingProtocolType.TARGET,
  INTENT: Enum_QuestionAskingProtocolType.INTENT,
};

const categoryMapper: CategoryMapper = {
  STATE: Enum_QuestionAskingProtocolCategory.STATE,
  GOAL: Enum_QuestionAskingProtocolCategory.GOAL,
  MEANS: Enum_QuestionAskingProtocolCategory.MEANS,
  EFFECT: Enum_QuestionAskingProtocolCategory.EFFECT,
  EXPLORATORY: Enum_QuestionAskingProtocolCategory.EXPLORATORY,
  CONFIRMATORY: Enum_QuestionAskingProtocolCategory.CONFIRMATORY,
};

const QuestionAskingProtocol = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_SESSION_QUESTIONS, {
    variables: {
      sessionId: id,
    },
  });
  if (loading) return <Loading />;
  return (
    <div className='my-3 flex w-full flex-col items-center gap-4 p-4'>
      <h1>Question classification</h1>
      <div className='flex w-full justify-center gap-4'>
        {Object.keys(QAPHierarchy).map((k: string) => (
          <div
            key={nanoid()}
            className='flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-4 shadow-lg'
          >
            <h2>{`${k} of the question`}</h2>
            <div className='grid grid-cols-2 gap-3'>
              {Object.keys(QAPHierarchy[k]).map((q: string) => (
                <QuestionCategory
                  key={nanoid()}
                  description={QAPHierarchy[k][q]}
                  category={categoryMapper[q]}
                  type={typeMapper[k]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <QuestionList data={data.getParticipantSessionQuestions} />
    </div>
  );
};

interface QuestionListInterface {
  data: ParticipantQuestion[];
}

const QuestionList = ({ data }: QuestionListInterface) => (
  <div className='card flex flex-col items-center gap-3'>
    <h1>Question list</h1>
    <table>
      <thead>
        <tr className='border'>
          <th className='border px-2'>Question</th>
          <th className='border px-2'>Type</th>
          <th className='border px-2'>Category</th>
        </tr>
      </thead>
      <tbody>
        {data.map((q: ParticipantQuestion) => (
          <tr className='border' key={q.id}>
            <td className='border px-2'>{q.question}</td>
            <td className='border px-2'>{q.questionType}</td>
            <td className='border px-2'>{q.questionCategory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface QuestionCategoryInterface {
  description: string;
  category: Enum_QuestionAskingProtocolCategory;
  type: Enum_QuestionAskingProtocolType;
}

const QuestionCategory = ({
  description,
  category,
  type,
}: QuestionCategoryInterface) => {
  const router = useRouter();
  const { id } = router.query;
  const [createQuestion] = useMutation(CREATE_PARTICIPANT_QUESTION);
  const [question, setQuestion] = useState<string>();
  const confirmQuestion = async () => {
    try {
      await createQuestion({
        variables: {
          data: {
            question,
            questionType: type,
            questionCategory: category,
            studySessionId: id,
          },
        },
        refetchQueries: [GET_SESSION_QUESTIONS],
      });
      setQuestion('');
      toast.success('Question classified correctly');
    } catch {
      toast.error('Error classifying the question');
    }
  };
  return (
    <div className='flex items-end'>
      <label htmlFor={category}>
        <span>{description}</span>
        <input
          name={category}
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
      </label>
      {!!question && (
        <Tooltip title='Confirm question annotation'>
          <button
            onClick={() => {
              confirmQuestion();
            }}
            type='button'
            className='cursor-pointer text-4xl text-green-500 hover:text-green-700'
          >
            <MdOutlineCheckCircle />
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export { QuestionAskingProtocol };
