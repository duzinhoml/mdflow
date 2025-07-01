import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
    query users {
        users {
            _id
            firstName
            lastName
            username
        }
    }
`;