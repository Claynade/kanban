import {Project} from '../models/projects.model.js';
import {User} from '../models/users.model.js';
import {Task} from '../models/tasks.model.js';
export const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        return res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProject = async (req, res) => {
    const {name} = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
    }
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const newProject = new Project({ name: name, authorizedUsers: [user._id.toString()], tasks: [] });
        await newProject.save();
        user.projects.push({ id: newProject._id, name: newProject.name });
        await user.save();
        res.status(201).json({ message: 'Project created successfully', newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        project.authorizedUsers = updatedProject.authorizedUsers || project.authorizedUsers;
        // if name is changed, update user.projects
        if (updatedProject.name && updatedProject.name !== project.name) {
            user.projects = user.projects.map(p => {
                if (p.id.toString() === id) {
                    return { id: p.id, name: updatedProject.name };
                }
                return p;
            });
            await user.save();
        }
        project.name = updatedProject.name || project.name;
    // Removed project.tasks update for consistency with new model
        await project.save();
        return res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        // Delete all tasks for this project
        await Task.deleteMany({ projectId: id });
        user.projects = user.projects.filter(p => p.id.toString() !== id);
        await user.save();
        await Project.deleteOne({ _id: id });
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
