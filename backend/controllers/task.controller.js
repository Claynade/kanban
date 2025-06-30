import { User } from '../models/users.model.js';
import { Task } from '../models/tasks.model.js';
import { Project } from '../models/projects.model.js';

export const getTask = async (req, res) => {
    const { id, task_id } = req.params;
    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.authorizedUsers.includes(user._id.toString())) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        const tasks = await Task.findOne({ _id : task_id });
        if (!tasks){
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createTask = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const { status, title, description } = req.body;
    if (!status || !title || !description) {
        return res.status(400).json({ message: 'Project ID, title, and description are required' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        //check if user is authorized to create tasks in this project
        if (!project.authorizedUsers.includes(user._id.toString())) { //why do we need toString() here?
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        const task = new Task({
            title,
            description,
            status,
            projectId: id,
            createdBy: user._id,
            assignedTo: [user._id]
        });
        await task.save(); //later: make it atomic with project update
        project.tasks.push(task._id);
        await project.save();
        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { task_id } = req.query;
    console.log("Updating task with data:", req.body, req.query);
    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        //check if user is authorized to update tasks in this project
        if (!project.authorizedUsers.includes(user._id.toString())) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        //check if task is included in the project
        if (!project.tasks.includes(task_id)) {
            return res.status(404).json({ message: 'Task not found in this project' });
        }
        const task = await Task.findOne({ _id: task_id, projectId: id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        /* task.assignedTo = req.body.assignedTo || task.assignedTo; */ // for later
        await task.save();
        return res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteTask = async (req, res) => {
    // only auth users can delete
    // project must exist
    // task must exist
    // task must be created by user
}