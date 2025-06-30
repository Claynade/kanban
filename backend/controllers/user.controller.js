let projectList = [];
import {User} from '../models/users.model.js';

export const getUserProjects = (req, res) => {
    res.json(projectList);
}
export const createUserProject = (req, res) => {
    const newProject = req.body;
    projectList.push(newProject);
    res.status(201).json(newProject);
}

export const updateUserProject = (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;
    const index = projectList.findIndex(project => project.id === id);
    
    if (index !== -1) {
        projectList[index] = { ...projectList[index], ...updatedProject };
        res.json(projectList[index]);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
}

export const deleteUserProject = (req, res) => {
    const { id } = req.params;
    const index = projectList.findIndex(project => project.id === id);

    if (index !== -1) {
        projectList.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
}