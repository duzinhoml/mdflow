import { Schema, model } from 'mongoose';

const sectionSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true
        },
        color: {
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

const Section = model('Section', sectionSchema);

export default Section;