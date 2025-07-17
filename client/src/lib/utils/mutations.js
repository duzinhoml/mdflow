import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const CREATE_SECTION = gql`
    mutation createSection($songId: ID!, $input: CreateSectionInput!) {
        createSection(songId: $songId, input: $input) {
            _id
            label
            color
        }
    }
`;

export const UPDATE_SECTION_ORDER = gql`
    mutation updateSectionOrder($songId: ID!, $sectionIds: [ID!]!) {
        updateSectionOrder(songId: $songId, sectionIds: $sectionIds) {
            _id
            title
            sections {
                _id
                label
                color
            }
        }
    }
`;

export const DELETE_SECTION_BY_ID = gql`
    mutation deleteSectionById($sectionId: ID!) {
        deleteSectionById(sectionId: $sectionId)
    }
`;