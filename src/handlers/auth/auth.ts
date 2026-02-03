import { Request, Response } from 'express';
import { authenticateUser, createUser } from '../../helpers/api';
import { createToken } from './middleware/authentication';

export const authenticate = async (req: Request, res: Response): Promise<void> => {
    const { username, pin } = req.body;
    console.log(`logging in with ${username} ${pin}`);
    try {
        const response = await authenticateUser(username, pin);
        if (response?.length === 0) {
            res.status(401).json({ message: 'User not found', status: 0, data: null });
        } else {
            const token = createToken(response[0].username);
            res.status(200).json({ message: 'User authenticated', status: 1, data: { ...response[0], token } });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', status: 0, data: null });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, pin } = req.body;
    console.log(`registering user ${username}`);
    try {
        const success = await createUser(username, pin);
        if (success) {
            res.status(201).json({ message: 'User registered successfully', status: 1, data: null });
        } else {
            res.status(409).json({ message: 'User already exists', status: 0, data: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', status: 0, data: null });
    }
};
