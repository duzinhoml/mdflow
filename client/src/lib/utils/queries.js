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

export const QUERY_ME = gql`
    query me {
        me {
            _id
            firstName
            lastName
            username
            songs {
                _id
                title
                sections {
                    _id
                    label
                    color
                    notes {
                        _id
                        label
                        color
                    }
                }
            }
        }
    }
`;