import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
     assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})

export const Task = mongoose.model('Task', taskSchema);