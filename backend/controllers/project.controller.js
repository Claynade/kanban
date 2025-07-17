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
        const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        // Later fix: however if someone edits their cookies, and find a valid authenticateKey, they can get someone else's project

        const user_id = user._id.toString();
        if (!project.authorizedUsers.includes(user_id)) {
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
    try{
        const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        // Later fix: however if someone edits their cookies, and find a valid authenticateKey, they can create a project for someone else
        const newProject = new Project({ name: name, authorizedUsers: [user._id.toString()], tasks: [] });
        await newProject.save()
        try {

            user.projects.push({ id: newProject._id, name: newProject.name });
            await user.save(); // make these atomic
        }
        catch (error) {
            console.error('Error updating user projects:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Project created successfully', newProject});
    }catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export const updateProject = async (req, res) => {
    const updatedProject = req.body;
    console.log('Updating project with ID:', id, 'with data:', updatedProject);
    try {
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const userId = user._id.toString();
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        project.authorizedUsers = updatedProject.authorizedUsers || project.authorizedUsers;
        // new authorized users should be notified
        // if name is change, update user.projects
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
        project.tasks = updatedProject.tasks || project.tasks;
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
        const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const userId = user._id.toString();
        if (!project.authorizedUsers.map(u => u.toString()).includes(userId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        // delete all the tasks in this project
        for (const taskId of project.tasks) {
            await Task.deleteOne({ _id: taskId });
        }
        // remove project from user's projects
        user.projects = user.projects.filter(p => p.id.toString() !== id);
        await user.save();
        await Project.deleteOne({ _id: id });
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
