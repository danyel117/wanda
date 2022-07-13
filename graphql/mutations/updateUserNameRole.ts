import { gql } from '@apollo/client';

const UPDATE_USER_NAME_ROLE = gql`
  mutation UpdateUserNameRole($name: String!, $role: Enum_RoleName!) {
    updateUserNameRole(name: $name, role: $role) {
      id
    }
  }
`;

export { UPDATE_USER_NAME_ROLE };
