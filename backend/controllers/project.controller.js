let projectList = [];
export const getProjects = (req, res) => {
    res.json(projectList);
}
export const createProject = (req, res) => {
    const newProject = req.body;
    projectList.push(newProject);
    res.status(201).json(newProject);
}

export const updateProject = (req, res) => {
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

export const deleteProject = (req, res) => {
    const { id } = req.params;
    const index = projectList.findIndex(project => project.id === id);

    if (index !== -1) {
        projectList.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
}