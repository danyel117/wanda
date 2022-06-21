import { gql } from 'apollo-server-micro';

const StudyTypes = gql`
  input CustomStudyCreateInput {
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

  input StudyCreateInputWithTasks {
    study: CustomStudyCreateInput
    tasks: [CustomTaskCreateInput]
  }

  type Mutation {
    createStudyWithTasks(data: StudyCreateInputWithTasks): Study
  }
`;

export { StudyTypes };
