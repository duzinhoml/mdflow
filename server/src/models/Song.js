import { Schema, model } from 'mongoose';

const songSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        sections: [{
            type: Schema.Types.ObjectId,
            ref: 'Section'
        }]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false,
        timestamps: true
    }
);

const Song = model('Song', songSchema);

export default Song;