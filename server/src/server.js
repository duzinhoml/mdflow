import express from 'express';
import cors from 'cors';
import db from './config/connection.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import path from 'node:path';

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const app = express();
const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {
    await server.start();
    await db();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken
    }));

    if (process.env.NODE_ENV === 'production') {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        app.use(express.static(path.join(__dirname, '../../client/dist')));

        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    };

    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};

startApolloServer();