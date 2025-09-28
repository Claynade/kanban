import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    authorizedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    shareableLink: {
        type: String,
        default: "",
    },
    adminUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Project = mongoose.model("Project", projectSchema);
