import { User} from '../models/users.model.js';
export const signup = async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Generate a unique authentication key for the user
        const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const existingKey = await User.findOne({ authenticateKey: randomKey });
        if (existingKey) {
            return res.status(500).json({ message: 'Error generating unique authentication key' });
        }
        const user = new User({name: name, email: email, password: password, projects: [], authenticateKey: randomKey});

        await user.save();

        res.cookie('authenticateKey', randomKey, {
            httpOnly: true,
            secure: true, // Important for Render (uses HTTPS)
            sameSite: 'None', // Allow cross-origin
            maxAge: 24 * 60 * 60 * 1000
        });
        
        const userData = {
            name: user.name,
            email: user.email,
            projects: user.projects
        };
        return res.status(200).json({
            message: "User created successfully!",
            user: userData
        });
    }catch (error){
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try{
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const authenticateKey = user.authenticateKey;
        res.cookie('authenticateKey', authenticateKey, {
            httpOnly: true,
            secure: true, // Important for Render (uses HTTPS)
            sameSite: 'None', // Allow cross-origin
            maxAge: 24 * 60 * 60 * 1000
        });

        const userData = {
            name: user.name,
            email: user.email,
            projects: user.projects
        };
        return res.status(200).json({
            message: "Login successful",
            user: userData
        });
    }catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}