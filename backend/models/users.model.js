import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    projects: [{
        type: String
    }],
    authenticateKey:{
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

export const User = mongoose.model('User', userSchema);