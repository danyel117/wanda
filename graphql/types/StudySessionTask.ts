import { gql } from 'apollo-server-micro';

const StudySessionTaskTypes = gql`
  type Mutation {
    updateStudySessionTaskWithTranscription(
      where: StudySessionTaskWhereUniqueInput!
      data: StudySessionTaskUpdateInput
    ): StudySessionTask
  }
`;
export { StudySessionTaskTypes };
