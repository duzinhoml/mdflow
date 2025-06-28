import { User } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';

const resolvers = {
    Query: {
        users: async () => {
            return await User.find({});
        },
        user: async (_, { username }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        },
        me: async (_, _args, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            return await User.findOne({ _id: context.user._id });
        }
    },
    Mutation: {
        createUser: async (_, { input }) => {
            try {
                input.username = input.username.trim().toLowerCase();
                input.password = input.password.trim();

                // Username Check
                const userUsername = await User.findOne({ username: input.username });
                if (userUsername) {
                    throw new Error('Username already exists');
                }

                const user = await User.create({ ...input });
                const token = signToken(user._id, user.username);
                return { token, user };
            } 
            catch (err) {
                throw new Error(`Error creating user: ${err.message}`);
            }
        },
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) {
                throw new Error('Incorrect password');
            }

            const token = signToken(user._id, user.username);
            return { token, user };
        },
        updateUser: async (_, { userId, input }, context) => {
            try {
                if (!context.user) {
                    throw new Error('Not authenticated');
                }

                if (input.password) {
                    const saltRounds = 10;
                    input.password = await bcrypt.hash(input.password, saltRounds);
                }

                const user = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: input },
                    { new: true }
                );

                if (!user) {
                    throw new Error('User not found or update failed');
                }

                return user;
            } 
            catch (err) {
                throw new Error(`Error updating user: ${err.message}`);
            }
        },
        deleteUserById: async (_, { userId }) => {
            try {
                const user = await User.findOne({ _id: userId });
                if (!user) {
                    throw new Error('User not found');
                }

                await User.findOneAndDelete({ _id: userId });
                return `${user.firstName} ${user.lastName}, your account has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting user: ${err.message}`);
            }
        }
    }
};

export default resolvers;