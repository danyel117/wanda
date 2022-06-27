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
    site: String
    script: Connect
  }

  input CustomTaskCreateInput {
    id: String
    description: String
    url: String
    recording: String
  }

  input EvaluationStudyCreateInputWithTasks {
    evaluationStudy: CustomEvaluationStudyCreateInput
    tasks: [CustomTaskCreateInput]
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
