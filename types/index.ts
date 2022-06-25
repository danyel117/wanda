import { EvaluationSession, Script, Study, User } from '@prisma/client';
import { Session } from 'next-auth';

interface Context {
  session: Session;
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

export interface UserStudy extends Study {
  taskCount: number;
  evaluationSummary: {
    pending: number;
    completed: number;
    total: number;
  };
}

export interface ExtendedStudy extends Study {
  script: Script;
}

export interface ExtendedEvaluationSession extends EvaluationSession {
  study: ExtendedStudy;
  participant: User;
}
