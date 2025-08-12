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

export const CREATE_SONG = gql`
    mutation createSong($input: CreateSongInput!) {
        createSong(input: $input) {
            _id
            title
        }
    }
`;

export const CREATE_SECTION = gql`
    mutation createSection($songId: ID!, $input: CreateSectionInput!) {
        createSection(songId: $songId, input: $input) {
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
`;

export const CREATE_NOTE = gql`
    mutation createNote($sectionId: ID!, $input: CreateNoteInput!) {
        createNote(sectionId: $sectionId, input: $input) {
            _id
            label
            color
        }
    }
`;

export const UPDATE_SONG_TITLE = gql`
    mutation updateSongTitle($songId: ID!, $title: String!) {
        updateSongTitle(songId: $songId, title: $title) {
            _id
            title
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

export const DELETE_SONG_BY_ID = gql`
    mutation deleteSongById($songId: ID!) {
        deleteSongById(songId: $songId)
    }
`;

export const DELETE_SECTION_BY_ID = gql`
    mutation deleteSectionById($sectionId: ID!) {
        deleteSectionById(sectionId: $sectionId)
    }
`;

export const DELETE_NOTE_BY_ID = gql`
    mutation deleteNoteById($noteId: ID!) {
        deleteNoteById(noteId: $noteId)
    }
`;