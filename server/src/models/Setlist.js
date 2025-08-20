import { Schema, model } from 'mongoose';

const setlistSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
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

const Setlist = model('Setlist', setlistSchema);

export default Setlist;