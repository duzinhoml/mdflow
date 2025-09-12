const typeDefs = `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
        setlists: [Setlist]
        songs: [Song]
    }

    type Setlist {
        _id: ID!
        title: String!
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

    input CreateSetlistInput {
        title: String!
    }

    input CreateSongInput {
        title: String!
    }

    input CreateSectionInput {
        label: String!
        color: String!
    }

    input CreateNoteInput {
        label: String!
    }

    input UpdateUserInput {
        username: String
        password: String
    }

    input UpdatePasswordInput {
        currentPassword: String!
        newPassword: String!
        confirmPassword: String!
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
        setlists: [Setlist]
        songs: [Song]
        song(songId: ID!): Song
        sections: [Section]
        notes: [Note]
    }

    type Mutation {
        createUser(input: CreateUserInput!): Auth
        login(username: String!, password: String!): Auth
        createSetlist(input: CreateSetlistInput!): Setlist
        createSong(setlistId: ID!, input: CreateSongInput!): Song
        createSection(songId: ID!, input: CreateSectionInput!): Section
        createNote(sectionId: ID!, input: CreateNoteInput!): Note

        updateUser(userId: ID!, input: UpdateUserInput!): User
        updatePassword(input: UpdatePasswordInput!): User
        updateSetlistTitle(setlistId: ID!, title: String!): Setlist
        updateSongTitle(songId: ID!, title: String!): Song
        updateSectionOrder(songId: ID!, sectionIds: [ID!]!): Song

        deleteUserById(userId: ID!): String
        deleteUser(confirmDelete: String!): String
        deleteSetlistById(setlistId: ID!): String
        deleteSongById(songId: ID!): String
        deleteSectionById(sectionId: ID!): String
        deleteNoteById(noteId: ID!): String
    }
`;

export default typeDefs;