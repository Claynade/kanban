import { User } from '../models/users.model.js';

// Get projects for authenticated user
export const getUserProjects = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ projects: user.projects });
};

// Get username by userId (public, but does not expose sensitive info)
export const getUsername = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ username: 'Unknown User' });
    }
    const user = await User.findById(userId).select('name');
    if (!user) {
        return res.status(404).json({ username: 'Unknown User' });
    }
    return res.status(200).json({ username: user.name });
};

// Get authenticated user data
export const getUserData = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
        name: user.name,
        email: user.email,
        projects: user.projects
    });
};