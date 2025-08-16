import { User } from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const verify = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: 'JWT secret not configured' });
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                projects: user.projects,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
};



export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const normalisedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalisedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email: normalisedEmail, password: hashedPassword, projects: [] });
        await user.save();
        return res.status(201).json({
            message: "Account created successfully!"
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const normalisedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalisedEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });
        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}