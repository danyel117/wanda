import { gql } from 'apollo-server-micro';

const StudyTypes = gql`
  type EvaluationStudyEvaluationSummary {
    pending: Int
    completed: Int
    total: Int
  }

  type EvaluationStudy {
    taskCount: Int
    evaluationSummary: EvaluationStudyEvaluationSummary
  }

  input CustomEvaluationStudyCreateInput {
    id: String
    name: String
    researchQuestion: String
    target: String
    site: String
    script: Connect
    status: Enum_EvaluationStudyStatus
  }

  input CustomTaskCreateInput {
    id: String
    description: String
    url: String
    recording: String
  }

  input CustomQuestionCreateInput {
    question: String
    position: Int
    sus: Boolean
  }

  input EvaluationStudyCreateInputWithTasks {
    evaluationStudy: CustomEvaluationStudyCreateInput
    tasks: [CustomTaskCreateInput]
    questions: [CustomQuestionCreateInput]
  }

  type Query {
    getUserStudies: [EvaluationStudy]
  }

  type Mutation {
    createEvaluationStudyWithTasks(
      data: EvaluationStudyCreateInputWithTasks
    ): EvaluationStudy
  }
`;

export { StudyTypes };
