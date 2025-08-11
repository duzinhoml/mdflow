const typeDefs = `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
        songs: [Song]
    }

    type Song {
        _id: ID!
        title: String!
        sections: [Section]
    }

    type Section {
        _id: ID!
        label: String!
        color: String!
        notes: [Note]
    }

    type Note {
        _id: ID!
        label: String!
        color: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        username: String!
        password: String!
    }

    input CreateSongInput {
        title: String!
        sections: [CreateSectionInput]
    }

    input CreateSectionInput {
        label: String!
        color: String!
    }

    input CreateNoteInput {
        label: String!
        color: String!
    }

    input UpdateUserInput {
        username: String
        password: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
        songs: [Song]
        song(songId: ID!): Song
        sections: [Section]
    }

    type Mutation {
        createUser(input: CreateUserInput!): Auth
        login(username: String!, password: String!): Auth
        createSong(input: CreateSongInput!): Song
        createSection(songId: ID!, input: CreateSectionInput!): Section
        createNote(sectionId: ID!, input: CreateNoteInput!): Note

        updateUser(userId: ID!, input: UpdateUserInput!): User
        updateSongTitle(songId: ID!, title: String!): Song
        updateSectionOrder(songId: ID!, sectionIds: [ID!]!): Song

        deleteUserById(userId: ID!): String
        deleteSongById(songId: ID!): String
        deleteSectionById(sectionId: ID!): String
        deleteNoteById(noteId: ID!): String
    }
`;

export default typeDefs;