/* eslint-disable no-nested-ternary */
import { useMutation, useQuery } from '@apollo/client';
import Loading from '@components/Loading';
import Modal from '@components/modals/Modal';
import { Enum_StudySessionStatus, Question } from '@prisma/client';
import { useStudySession } from 'context/studySession';
import { CREATE_QUESTION_RESPONSE } from 'graphql/mutations/questionResponse';
import { GET_STUDY_QUESTIONNAIRE } from 'graphql/queries/questionnaire';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useUpdateStudySessionData } from '@components/StudySession/common/updateStudySessionData';

interface ResponseState {
  [key: string]: {
    response: string;
    responseType: 'SUS' | 'TEXT';
    question: Question;
  };
}

const QuestionnaireState = () => {
  const [responseState, setResponseState] = useState<ResponseState>({});
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lastQuestion, setLastQuestion] = useState<boolean>(false);
  const [summary, setSummary] = useState<boolean>(false);
  const { session } = useStudySession();
  const { data: questionnaire, loading } = useQuery(GET_STUDY_QUESTIONNAIRE, {
    fetchPolicy: 'network-only',
    variables: {
      studyId: session.study.id,
    },
  });

  const nextQuestion = () => {
    if (!currentQuestion) {
      setCurrentQuestion(
        questionnaire.getStudyQuestionnaire.questions.find(
          (q: Question) => q.position === 1
        )
      );
    } else if (!lastQuestion) {
      if (
        currentQuestion.position + 1 ===
        questionnaire.getStudyQuestionnaire.questions.length
      ) {
        setLastQuestion(true);
      }
      setCurrentQuestion(
        questionnaire.getStudyQuestionnaire.questions.find(
          (q: Question) => q.position === currentQuestion.position + 1
        )
      );
    } else {
      setSummary(true);
    }
  };

  const previousQuestion = () => {
    if (lastQuestion) {
      setLastQuestion(false);
    }

    if (currentQuestion) {
      if (currentQuestion.position - 1 === 0) {
        setCurrentQuestion(null);
      }
      setCurrentQuestion(
        questionnaire.getStudyQuestionnaire.questions.find(
          (q: Question) => q.position === currentQuestion.position - 1
        )
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!currentQuestion) {
    return (
      <BeginQuestionnaire
        total={questionnaire.getStudyQuestionnaire.questions.length}
        nextQuestion={nextQuestion}
      />
    );
  }

  if (summary) {
    return (
      <Summary
        responseState={responseState}
        setCurrentQuestion={setCurrentQuestion}
        setSummary={setSummary}
        setLastQuestion={setLastQuestion}
      />
    );
  }

  return (
    <QuestionComponent
      previousQuestion={previousQuestion}
      nextQuestion={nextQuestion}
      question={currentQuestion}
      responseState={responseState}
      setResponseState={setResponseState}
    />
  );
};

const BeginQuestionnaire = ({
  nextQuestion,
  total,
}: {
  nextQuestion: () => void;
  total: number;
}) => (
  <div className='flex flex-col gap-4'>
    <span>
      Thank you for participating in the study. Now, we will ask you
      {` ${total} `}
      questions about your experience with the website.
    </span>
    <div className='flex w-full justify-center'>
      <button
        type='button'
        className='primary'
        onClick={() => {
          nextQuestion();
        }}
      >
        Begin questionnaire
      </button>
    </div>
  </div>
);

interface QuestionComponentInterface {
  question: Question;
  previousQuestion: () => void;
  nextQuestion: () => void;
  responseState: ResponseState;
  setResponseState: Dispatch<SetStateAction<ResponseState>>;
}

const QuestionComponent = ({
  question,
  previousQuestion,
  nextQuestion,
  responseState,
  setResponseState,
}: QuestionComponentInterface) => {
  const submitQuestion = (e: SyntheticEvent) => {
    e.preventDefault();
    nextQuestion();
  };
  return (
    <form onSubmit={submitQuestion} className='flex items-center gap-3'>
      <div>
        <button
          type='button'
          className='text-4xl disabled:text-gray-500'
          disabled={!question}
          onClick={() => {
            previousQuestion();
          }}
        >
          <MdNavigateBefore />
        </button>
      </div>
      <div className='flex w-[700px] flex-col gap-3'>
        <div className='flex'>
          <h3 className='border-b border-b-indigo-500'>
            Question {question.position}
          </h3>
        </div>
        <span className='h-14'>{question.question}</span>
        {question.sus ? (
          <>
            <label
              className='flex cursor-pointer flex-row gap-3'
              htmlFor={`answer-${question.position}-1`}
            >
              <input
                required
                id={`answer-${question.position}-1`}
                type='radio'
                name={`answer-${question.position}`}
                checked={responseState[question.id]?.response === '1'}
                onChange={() =>
                  setResponseState({
                    ...responseState,
                    [question.id]: {
                      response: '1',
                      responseType: 'SUS',
                      question,
                    },
                  })
                }
              />
              <span>Strongly disagree</span>
            </label>
            <label
              className='flex cursor-pointer flex-row gap-3'
              htmlFor={`answer-${question.position}-2`}
            >
              <input
                required
                id={`answer-${question.position}-2`}
                type='radio'
                name={`answer-${question.position}`}
                checked={responseState[question.id]?.response === '2'}
                onChange={() =>
                  setResponseState({
                    ...responseState,
                    [question.id]: {
                      response: '2',
                      responseType: 'SUS',
                      question,
                    },
                  })
                }
              />
              <span>Partially disagree</span>
            </label>
            <label
              className='flex cursor-pointer flex-row gap-3'
              htmlFor={`answer-${question.position}-3`}
            >
              <input
                required
                id={`answer-${question.position}-3`}
                type='radio'
                name={`answer-${question.position}`}
                checked={responseState[question.id]?.response === '3'}
                onChange={() =>
                  setResponseState({
                    ...responseState,
                    [question.id]: {
                      response: '3',
                      responseType: 'SUS',
                      question,
                    },
                  })
                }
              />
              <span>Neither agree nor disagree</span>
            </label>
            <label
              className='flex cursor-pointer flex-row gap-3'
              htmlFor={`answer-${question.position}-4`}
            >
              <input
                required
                id={`answer-${question.position}-4`}
                type='radio'
                name={`answer-${question.position}`}
                checked={responseState[question.id]?.response === '4'}
                onChange={() =>
                  setResponseState({
                    ...responseState,
                    [question.id]: {
                      response: '4',
                      responseType: 'SUS',
                      question,
                    },
                  })
                }
              />
              <span>Partially agree</span>
            </label>
            <label
              className='flex cursor-pointer flex-row gap-3'
              htmlFor={`answer-${question.position}-5`}
            >
              <input
                required
                id={`answer-${question.position}-5`}
                type='radio'
                name={`answer-${question.position}`}
                checked={responseState[question.id]?.response === '5'}
                onChange={() =>
                  setResponseState({
                    ...responseState,
                    [question.id]: {
                      response: '5',
                      responseType: 'SUS',
                      question,
                    },
                  })
                }
              />
              <span>Strongly agree</span>
            </label>
          </>
        ) : (
          <label htmlFor={`answer-${question.id}`}>
            <textarea
              required
              id={`answer-${question.id}`}
              className='h-28 w-full'
              placeholder='Type your answer here'
              value={responseState[question.id]?.response ?? ''}
              onChange={(e) =>
                setResponseState({
                  ...responseState,
                  [question.id]: {
                    response: e.target.value,
                    responseType: 'TEXT',
                    question,
                  },
                })
              }
            />
          </label>
        )}
      </div>
      <div>
        <button type='submit' className='text-4xl disabled:text-gray-500'>
          <MdNavigateNext />
        </button>
      </div>
    </form>
  );
};

const SusMapper = {
  '1': 'Strongly disagree',
  '2': 'Partially disagree',
  '3': 'Neither agree nor disagree',
  '4': 'Partially agree',
  '5': 'Strongly agree',
};

interface SummaryInterface {
  responseState: ResponseState;
  setSummary: Dispatch<SetStateAction<boolean>>;
  setCurrentQuestion: Dispatch<SetStateAction<Question | null>>;
  setLastQuestion: Dispatch<SetStateAction<boolean>>;
}

const Summary = ({
  responseState,
  setSummary,
  setCurrentQuestion,
  setLastQuestion,
}: SummaryInterface) => {
  const { updateStudySession } = useUpdateStudySessionData();
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useStudySession();
  const [createResponses] = useMutation(CREATE_QUESTION_RESPONSE);

  const editAnswers = () => {
    setSummary(false);
    setCurrentQuestion(null);
    setLastQuestion(false);
  };

  const submitAnswers = async () => {
    setLoading(true);
    const responses = Object.values(responseState).map((response) => {
      if (response.responseType === 'SUS') {
        return {
          questionId: response.question.id,
          responseNumber: parseInt(response.response, 10),
          studySessionId: session.id,
        };
      }

      return {
        questionId: response.question.id,
        responseText: response.response,
        studySessionId: session.id,
      };
    });

    try {
      await Promise.all(
        responses.map(
          async (r) =>
            await createResponses({
              variables: {
                data: {
                  ...r,
                },
              },
            })
        )
      );
      await updateStudySession({
        id: session.id,
        data: {
          status: {
            set: Enum_StudySessionStatus.COMPLETED,
          },
        },
      });
      toast.success('Answers saved successfully');
    } catch {
      toast.error('There was an error saving your answers.');
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex'>
        <h3 className='border-b border-b-indigo-500'>Questionnaire summary</h3>
      </div>
      <div className='h-96 overflow-y-auto'>
        {Object.keys(responseState).map((key, index) => (
          <div className='my-3 flex flex-col'>
            <div className='block'>
              <span className='font-bold'>{`Question ${index + 1}: `}</span>
              <span>{responseState[key].question.question}</span>
            </div>
            <div>
              <span className='font-bold'>Answer: </span>
              {responseState[key].responseType === 'SUS' ? (
                <span>
                  {
                    SusMapper[
                      responseState[key].response as '1' | '2' | '3' | '4' | '5'
                    ]
                  }
                </span>
              ) : (
                <span>{responseState[key].response}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='flex h-full w-full justify-center gap-3'>
        <button onClick={editAnswers} type='button' className='secondary'>
          Edit answers
        </button>
        <button onClick={submitAnswers} type='button' className='primary'>
          {loading ? <Loading /> : 'Confirm answers'}
        </button>
      </div>
    </div>
  );
};

const ModalQuestionnaireState = () => (
  <Modal open setOpen={() => {}}>
    <QuestionnaireState />
  </Modal>
);

export { ModalQuestionnaireState };
