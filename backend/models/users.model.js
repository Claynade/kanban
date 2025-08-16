import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false // always exclude password unless explicitly requested
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    projects: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
});

export const User = mongoose.model('User', userSchema);