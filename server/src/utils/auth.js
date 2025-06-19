import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    if (!token) {
        return req;
    }

    try {
        const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
        req.user = data;
    } 
    catch (err) {
        console.log('Invalid token');
    }

    return req;
};

export const signToken = ({ _id, username }) => {
    const payload = { _id, username };
    const secretKey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ data: payload }, secretKey, { expiresIn: '2hr' });
};