import {User} from '../models/users.model.js';

export const getUserProjects = async (req, res) => {

    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    return res.json({projects: user.projects});

}
export const getUsername = async (req, res) => {
    const {userId} = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    if (!user.name) {
        return res.status(404).json({username: "ghost user"});
    }
    return res.json({ username: user.name });
}

export const getUserData = async (req, res) => {
    const user = await User.findOne({ authenticateKey: req.cookies.authenticateKey });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const userData = {
        name: user.name,
        email: user.email
    };
    return res.status(200).json({
        user: userData
    });
}