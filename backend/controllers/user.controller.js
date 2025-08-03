import {User} from '../models/users.model.js';

export const getUserProjects = async (req, res) => {

    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    return res.json({projects: user.projects});

}

export const getUserData = async (req, res) => {
    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    return res.status(200).json({
        name: user.name,
        email: user.email
    });
}