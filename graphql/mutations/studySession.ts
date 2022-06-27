import { gql } from '@apollo/client';

const CREATE_STUDY_SESSION = gql`
  mutation CreateStudySessionNoUser($data: StudySessionNoUserInput) {
    createStudySessionNoUser(data: $data) {
      id
    }
  }
`;

const UPDATE_STUDY_SESSION = gql`
  mutation UpdateStudySession(
    $where: StudySessionWhereUniqueInput!
    $data: StudySessionUpdateInput
  ) {
    updateStudySession(where: $where, data: $data) {
      id
    }
  }
`;

const UPDATE_STUDY_SESSION_TASK = gql`
  mutation UpdateStudySessionTask(
    $where: StudySessionTaskWhereUniqueInput!
    $data: StudySessionTaskUpdateInput
  ) {
    updateStudySessionTask(where: $where, data: $data) {
      id
    }
  }
`;

const UPDATE_STUDY_SESSION_DATA = gql`
  mutation UpdateStudySessionData(
    $where: StudySessionDataWhereUniqueInput!
    $data: StudySessionDataUpdateInput
  ) {
    updateStudySessionData(where: $where, data: $data) {
      id
    }
  }
`;

export {
  CREATE_STUDY_SESSION,
  UPDATE_STUDY_SESSION,
  UPDATE_STUDY_SESSION_TASK,
  UPDATE_STUDY_SESSION_DATA,
};
