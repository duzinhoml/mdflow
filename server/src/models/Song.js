import { Schema, model } from 'mongoose';

const songSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        bpm: {
            type: Number,
            default: 120,
            min: 20,
            max: 320
        },
        timeSignature: {
            type: String,
            default: '4/4',
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