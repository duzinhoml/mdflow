const typeDefs = `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
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

    input UpdateUserInput {
        username: String
        password: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
    }

    type Mutation {
        createUser(input: CreateUserInput!): Auth
        login(username: String!, password: String!): Auth

        updateUser(userId: ID!, input: UpdateUserInput!): User

        deleteUserById(userId: ID!): String
    }
`;

export default typeDefs;