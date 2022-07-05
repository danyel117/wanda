import { StudySessionResolvers } from 'graphql/resolvers/StudySession';
import { Resolver } from 'types';
import { ScriptResolvers } from 'graphql/resolvers/Script';
import { EvaluationStudyResolvers } from 'graphql/resolvers/EvaluationStudy';
import { TaskResolvers } from 'graphql/resolvers/Task';
import { QuestionnaireResolvers } from 'graphql/resolvers/Questionnaire';

const customResolvers: Resolver[] = [
  StudySessionResolvers,
  ScriptResolvers,
  EvaluationStudyResolvers,
  TaskResolvers,
  QuestionnaireResolvers,
];

export { customResolvers };
