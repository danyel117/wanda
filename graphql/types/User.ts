import { gql } from 'apollo-server-micro';

const UserTypes = gql`
  type Mutation {
    updateUserNameRole(name: String!, role: Enum_RoleName!): User
  }
`;

export { UserTypes };
