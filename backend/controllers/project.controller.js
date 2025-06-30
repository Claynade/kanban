import {Project} from '../models/projects.model.js';
import {User} from '../models/users.model.js';
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
        const newProject = new Project({ name: name, authorizedUsers: [user._id.toString()], tasks: [] });
        await newProject.save()
        user.projects.push(newProject._id);
        await user.save(); // make these atomic
        res.status(201).json({ message: 'Project created successfully', newProject});
    }catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateProject = async (req, res) => {
    const { id } = req.params;
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
        project.name = updatedProject.name || project.name;
        project.authorizedUsers = updatedProject.authorizedUsers || project.authorizedUsers;
        // new authorized users should be notified
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
        await Project.deleteOne({ _id: id });
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
