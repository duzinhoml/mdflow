import { User, Song, Section } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';

const resolvers = {
    Query: {
        users: async () => {
            return await User.find({}).populate(
                { path: 'songs', 
                    populate: {
                        path: 'sections'
                    }
                }
            );
        },
        user: async (_, { username }) => {
            const user = await User.findOne({ username });
            if (!user) throw new Error('User not found');

            return user;
        },
        me: async (_, _args, context) => {
            if (!context.user) throw new Error('Not authenticated');

            return await User.findOne({ _id: context.user._id }).populate(
                { path: 'songs',
                    populate: {
                        path: 'sections'
                    }
                }
            );
        },
        songs: async () => {
            return await Song.find({}).populate('sections');
        },
        song: async (_, { songId }) => {
            const song = await Song.findOne({ _id: songId }).populate('sections');
            if (!song) throw new Error('Song not found');

            return song;
        }
    },
    Mutation: {
        createUser: async (_, { input }) => {
            try {
                input.username = input.username.trim().toLowerCase();
                input.password = input.password.trim();

                // Username Check
                const userUsername = await User.findOne({ username: input.username });
                if (userUsername) throw new Error('Username already exists');

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
            if (!user) throw new Error('User not found');

            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) throw new Error('Incorrect password');

            const token = signToken(user._id, user.username);
            return { token, user };
        },
        createSong: async (_, { input }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const { title } = input;
                const song = await Song.create({ title });
                if (!song) throw new Error('Song creation failed');

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { songs: song._id } },
                    { new: true }
                );

                if (!updatedUser) throw new Error('User update failed');
                
                return song;
            } 
            catch (err) {
                throw new Error(`Error creating song: ${err.message}`);
            }
        },
        createSection: async (_, { songId, input }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const section = await Section.create({ ...input });
                if (!section) throw new Error('Section creation failed');

                const updatedSong = await Song.findOneAndUpdate(
                    { _id: songId },
                    { $push: { sections: section._id } },
                    { new: true }
                );
                if (!updatedSong) throw new Error('Song update failed');

                return section;
            } 
            catch (err) {
                throw new Error(`Error creating section: ${err.message}`);
            }
        },
        updateUser: async (_, { userId, input }, context) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                if (input.password) {
                    const saltRounds = 10;
                    input.password = await bcrypt.hash(input.password, saltRounds);
                }

                const user = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: input },
                    { new: true }
                );

                if (!user) throw new Error('User not found or update failed');

                return user;
            } 
            catch (err) {
                throw new Error(`Error updating user: ${err.message}`);
            }
        },
        updateSectionOrder: async (_, { songId, sectionIds }, context) => {
            try {
                if (!context.user) throw new Error('Not Authenticated');

                const song = await Song.findOneAndUpdate(
                    { _id: songId },
                    { $set: {
                        sections: sectionIds
                    }},
                    { new: true }
                );

                if (!song) throw new Error('Song not found or update failed');

                return song.populate('sections');
            } 
            catch (err) {
                throw new Error(`Error updating song: ${err.message}`);
            }
        },
        deleteUserById: async (_, { userId }) => {
            try {
                const user = await User.findOne({ _id: userId });
                if (!user) throw new Error('User not found');

                await User.findOneAndDelete({ _id: userId });
                return `${user.firstName} ${user.lastName}, your account has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting user: ${err.message}`);
            }
        },
        deleteSongById: async (_, { songId }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const song = await Song.findOne({ _id: songId });
                if (!song) throw new Error('Song not found');

                await Section.deleteMany({ _id: { $in: song.sections } });
                await Song.findOneAndDelete({ _id: songId });
                return `Song titled "${song.title}" has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting song: ${err.message}`);
            }
        },
        deleteSectionById: async (_, { sectionId }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const section = await Section.findOne({ _id: sectionId });
                if (!section) throw new Error('Section not found');

                await Section.findOneAndDelete({ _id: sectionId });
                return `Section titled "${section.label}" has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting section: ${err.message}`);
            }
        }
    }
};

export default resolvers;