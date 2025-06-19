import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const db = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected');
        return mongoose.connection;
    } 
    catch (err) {
        console.error('Database connection error:', err);
        throw new Error('Database connection failed.');
    };
};

export default db;