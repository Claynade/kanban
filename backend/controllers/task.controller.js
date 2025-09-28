import { User } from '../models/users.model.js';
import { Task } from '../models/tasks.model.js';
import { Project } from '../models/projects.model.js';

export const getTask = async (req, res) => {
    const { id, task_id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        const task = await Task.findOne({ _id: task_id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.json(task);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const { status, title, description, priority } = req.body;
    if (!status || !title || !description || !priority) {
        return res.status(400).json({ message: 'Project ID, title, description, and priority are required' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        const task = new Task({
            title,
            description,
            status,
            priority,
            projectId: id,
            createdBy: userId,
            assignedTo: []
        });
        await task.save();
        project.tasks.push(task._id);
        await project.save();
        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req, res) => {
    const { id, task_id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        // No project.tasks array, just check if the task exists for this project
        const task = await Task.findOne({ _id: task_id, projectId: id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        task.priority = req.body.priority || task.priority;
        await task.save();
        return res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteTask = async (req, res) => {
    const { id, task_id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        const task = await Task.findOne({ _id: task_id, projectId: id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        await Task.deleteOne({ _id: task_id });
        project.tasks = project.tasks.filter(t => t.toString() !== task_id);
        await project.save();
        return res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTasksForProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized access' });

    // Check project and authorization
    const project = await Project.findById(id).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
        return res.status(403).json({ message: 'Unauthorized access to project' });
    }

    // Fetch tasks directly by projectId, populate user info
    const tasks = await Task.find({ projectId: id })
        .populate('createdBy', 'name email')
        .populate('assignedTo.id', 'name email')
        .lean();

    return res.json(tasks);
};