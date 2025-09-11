import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

const Note = model('Note', noteSchema);

export default Note;