import { StudySessionResolvers } from 'graphql/resolvers/StudySession';
import { Resolver } from 'types';
import { ScriptResolvers } from 'graphql/resolvers/Script';
import { EvaluationStudyResolvers } from 'graphql/resolvers/EvaluationStudy';
import { TaskResolvers } from 'graphql/resolvers/Task';
import { QuestionnaireResolvers } from 'graphql/resolvers/Questionnaire';
import { StudySessionTaskResolvers } from 'graphql/resolvers/StudySessionTask';

const customResolvers: Resolver[] = [
  StudySessionResolvers,
  ScriptResolvers,
  EvaluationStudyResolvers,
  TaskResolvers,
  QuestionnaireResolvers,
  StudySessionTaskResolvers,
];

export { customResolvers };
