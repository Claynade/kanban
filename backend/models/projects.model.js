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
/*     description: {
        type: String,
        required: true,
        trim: true
    }, */
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    authorizedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

});

export const Project = mongoose.model('Project', projectSchema);
