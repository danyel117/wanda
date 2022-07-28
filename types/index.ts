import {
  StudySession,
  StudySessionData,
  Script,
  EvaluationStudy,
  Task,
  User,
  StudySessionTask,
  QuestionResponse,
  Question,
} from '@prisma/client';
import { NextApiRequest } from 'next';
import { Session } from 'next-auth';

export interface Context {
  session: Session;
  req: NextApiRequest;
}

interface ResolverFunction {
  [key: string]: (parent: any, args: any, context: Context, info: any) => any;
}

export interface Resolver {
  Query: ResolverFunction;
  Mutation: ResolverFunction;
  [key: string]: ResolverFunction;
}

export type ParsedFormData = Record<
  string,
  string | File | number | boolean | { file: File; id: string }
>;

export interface UserStudy extends EvaluationStudy {
  taskCount: number;
  evaluationSummary: {
    pending: number;
    completed: number;
    total: number;
  };
}

export interface ExtendedStudy extends EvaluationStudy {
  script: Script;
}

export interface ExtendedStudySessionTask extends StudySessionTask {
  task: Task;
  session: StudySession;
}
export interface ExtendedQuestionResponse extends QuestionResponse {
  question: Question;
}

export interface ExtendedStudySession extends StudySession {
  study: ExtendedStudy;
  participant: User;
  expert: User;
  data: StudySessionData;
  taskList: ExtendedStudySessionTask[];
  questionResponses: ExtendedQuestionResponse[];
  sus: number;
}
