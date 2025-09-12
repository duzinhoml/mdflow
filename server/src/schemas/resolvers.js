import { User, Setlist, Song, Section, Note } from '../models/index.js';
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

            return await User.findOne({ _id: context.user._id }).populate([
                { 
                    path: 'setlists',
                    populate: {
                        path: 'songs',
                        populate: {
                            path: 'sections',
                            populate: {
                                path: 'notes'
                            }
                        }
                    }
                },
                {
                    path: 'songs',
                    populate: {
                        path: 'sections',
                        populate: {
                            path: 'notes'
                        }
                    }
                }
            ]);
        },
        setlists: async () => {
            return await Setlist.find({})
            .populate(
                { 
                    path: 'songs',
                    populate: { 
                        path: 'sections',
                        populate: {
                            path: 'notes'
                        }
                    }
                }
            )
        },
        songs: async () => {
            return await Song.find({}).populate(
                { path: 'sections',
                    populate: {
                        path: 'notes'
                    }
                }
            );
        },
        song: async (_, { songId }) => {
            const song = await Song.findOne({ _id: songId }).populate('sections');
            if (!song) throw new Error('Song not found');

            return song;
        },
        sections: async () => {
            return await Section.find({});
        },
        notes: async () => {
            return await Note.find({});
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
        createSetlist: async (_, { input }, context) => {
            if (!context.user) throw new Error("Not Authenticated");

            try {
                const { title } = input;
                const newSetlist = await Setlist.create({ title });
                if (!newSetlist) throw new Error('Song creation failed');

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { setlists: newSetlist._id } },
                    { new: true }
                );

                if (!updatedUser) throw new Error('User update failed');

                return newSetlist;
            } 
            catch (err) {
                throw new Error(`Error creating setlist: ${err.message}`);
            }
        },
        createSong: async (_, { setlistId, input }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const { title } = input;
                const newSong = await Song.create({ title });
                if (!newSong) throw new Error('Song creation failed');

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { songs: newSong._id } },
                    { new: true }
                );
                if (!updatedUser) throw new Error('User update failed');

                const updatedSetlist = await Setlist.findOneAndUpdate(
                    { _id: setlistId },
                    { $push: { songs: newSong._id } },
                    { new: true }
                );
                if (!updatedSetlist) throw new Error('Setlist update failed');
                
                return newSong;
            } 
            catch (err) {
                throw new Error(`Error creating song: ${err.message}`);
            }
        },
        createSection: async (_, { songId, input }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const newSection = await Section.create({ ...input })

                const updatedSong = await Song.findOneAndUpdate(
                    { _id: songId },
                    { $push: { sections: newSection._id } },
                    { new: true }
                );
                if (!updatedSong) throw new Error('Song update failed');

                return newSection;
            } 
            catch (err) {
                throw new Error(`Error creating section: ${err.message}`);
            }
        },
        createNote: async (_, { sectionId, input }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const newNote = await Note.create({ ...input });

                const updatedSection = await Section.findOneAndUpdate(
                    { _id: sectionId },
                    { $push: {
                        notes: newNote._id
                    } },
                    { new: true }
                );
                if (!updatedSection) throw new Error('Section update failed');

                return newNote;
            } 
            catch (err) {
                throw new Error(`Error creating note: ${err.message}`);
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
        updatePassword: async (_, { input }, context) => {
            if (!context.user) throw new Error("Not Authenticated");

            try {
                const user = await User.findOne({ _id: context.user._id });
                
                input.currentPassword = input.currentPassword.trim();

                const correctPW = await user.isCorrectPassword(input.currentPassword);
                if (!correctPW) throw new Error("Incorrect password");

                if (input.newPassword.length < 8) throw new Error("Password must be at least 8 characters long.");
                if (input.newPassword.length > 50) throw new Error("Password cannot exceed 50 characters.");

                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(input.newPassword)) throw new Error("Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.");

                if (input.newPassword !== input.confirmPassword) throw new Error('Passwords do not match');

                const saltRounds = 10;
                input.newPassword = await bcrypt.hash(input.newPassword, saltRounds);

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $set: {
                        password: input.newPassword
                    } },
                    { new: true }
                );

                if (!updatedUser) throw new Error("User not found or update failed");
                return updatedUser;
            } 
            catch (err) {
                throw new Error(err.message);
            }
        },
        updateSetlistTitle: async (_, { setlistId, title}, context) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const updatedSetlist = await Setlist.findOneAndUpdate(
                    { _id: setlistId },
                    { $set: { title } },
                    { new: true }
                );

                if (!updatedSetlist) throw new Error('Setlist not found or update failed');

                return updatedSetlist;
            } 
            catch (err) {
                throw new Error(`Error updating setlist title: ${err.message}`);
            }
        },
        updateSongTitle: async (_, { songId, title }, context) => {
            try {
                if (!context.user) throw new Error('Not authenticated');

                const updatedSong = await Song.findOneAndUpdate(
                    { _id: songId },
                    { $set: { title } },
                    { new: true }
                );

                if (!updatedSong) throw new Error('Song not found or update failed');

                return updatedSong.populate('sections');
            } 
            catch (err) {
                throw new Error(`Error updating song title: ${err.message}`);
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
        deleteUser: async (_, { confirmDelete }, context) => {
            if (!context.user) throw new Error("Not authenticated");

            try {
                if (confirmDelete !== context.user.username) throw new Error("Incorrect confirmation");

                const user = await User.findOne({ _id: context.user._id }).populate([
                    {
                        path: "setlists",
                        populate: {
                            path: "songs",
                            populate: {
                                path: "sections",
                                populate: {
                                    path: "notes"
                                }
                            }
                        }
                    }
                ]);

                if (!user) throw new Error("User not found");
                const fullName = `${user.firstName} ${user.lastName}`;

                const noteIds = user.setlists?.flatMap(
                    setlist => setlist.songs?.flatMap(
                        song => song.sections?.flatMap(
                            section => section.notes
                        ) || []
                    ) || []
                ) || [];

                const sectionIds = user.setlists?.flatMap(
                    setlist => setlist.songs?.flatMap(
                        song => song.sections
                    ) || []
                ) || [];

                const songIds = user.setlists?.flatMap(setlist => setlist.songs) || [];

                await Note.deleteMany({ _id: { $in: noteIds } });
                await Section.deleteMany({ _id: { $in: sectionIds } });
                await Song.deleteMany({ _id: { $in: songIds } });
                await Setlist.deleteMany({ _id: { $in: user.setlists } });
                await User.findOneAndDelete({ _id: context.user._id });

                return `${fullName}, your account and it's associated contents have been deleted.`;
            } 
            catch (err) {
                throw new Error(err.message);
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
        deleteSetlistById: async (_, { setlistId }, context) => {
            if (!context.user) throw new Error("Not authenticated");

            try {
                const setlist = await Setlist.findOne({ _id: setlistId }).populate(
                    { 
                        path: 'songs',
                        populate: {
                            path: 'sections',
                            populate: {
                                path: 'notes'
                            }
                        }
                    }
                );
                if (!setlist) throw new Error("Setlist not found");

                const noteIds = setlist.songs.flatMap(song => song.sections.flatMap(section => section.notes));
                const sectionIds = setlist.songs.flatMap(song => song.sections);

                await Note.deleteMany({ _id: { $in: noteIds }});
                await Section.deleteMany({ _id: { $in: sectionIds }});
                await Song.deleteMany({ _id: { $in: setlist.songs }});
                await Setlist.findOneAndDelete({ _id: setlistId });
                return `Setlist titled "${setlist.title}" has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting setlist: ${err.message}`);
            }
        },
        deleteSongById: async (_, { songId }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            try {
                const song = await Song.findOne({ _id: songId }).populate('sections');
                if (!song) throw new Error('Song not found');

                const noteIds = song.sections.flatMap(section => section.notes);
                
                await Note.deleteMany({ _id: { $in: noteIds }});
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

                await Note.deleteMany({ _id: { $in: section.notes } });
                await Section.findOneAndDelete({ _id: sectionId });
                return `Section titled "${section.label}" has been deleted successfully.`;
            } 
            catch (err) {
                throw new Error(`Error deleting section: ${err.message}`);
            }
        },
        deleteNoteById: async (_, { noteId }, context) => {
            if (!context.user) throw new Error("Not authenticated");

            try {
                const note = await Note.findOne({ _id: noteId });
                if (!note) throw new Error("Section not found");

                await Note.findOneAndDelete({ _id: noteId });
                return `Note titled "${note.label}" has been deleted successfully.`;
            } 
            catch (err) {
                console.error(err);
            }
        }
    }
};

export default resolvers;