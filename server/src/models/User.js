import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            minLength: [3, 'Username must be at least 3 characters long.'],
            maxLength: [30, 'Username cannot exceed 30 characters.'],
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, 'Password must be at least 3 characters long.'],
            maxLength: [50, 'Password cannot exceed 50 characters.'],
        },
        setlists: [{
            type: Schema.Types.ObjectId,
            ref: 'Setlist'
        }],
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltrounds = 10;
        this.password = await bcrypt.hash(this.password, saltrounds);
    }
    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;