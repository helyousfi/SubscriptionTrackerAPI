import mongoose from 'mongoose';
import { JWT_SECRET, JWT_EXPIRE_IN } from '../config/env.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Sign Up
export const signup = async (req, res, next) => {
    // Start a session to handle transactions
    const session = await mongoose.startSession();

    // Start the transaction
    session.startTransaction();

    try {
        const { username, email, password, age } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ email }).session(session);
        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10); // Async method for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Async method for hashing

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            age
        });

        // Save the new user within the transaction
        await newUser.save({ session });

        // Generate token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });

        // Commit the transaction
        await session.commitTransaction();

        // Respond with the token and user data
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser
            }
        });  

    } catch (error) {
        // Rollback the transaction if there's an error
        await session.abortTransaction();
        console.error("Error during sign-up:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
            error: error.message
        });
    } finally {
        // End the session in the finally block
        session.endSession();
    }
};

// Sign In
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        
        if(!user) {
            const error = new Error('User does not exist');
            error.statusCode = 400;
            throw error;
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });
        // Respond with the token and user data
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data : {
                token,
                user
            }
        });  

    } catch (error) {
        // Rollback the transaction if there's an error
        console.error("Error during sign-in:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
            error: error.message
        });
    }
};

// Sign Out
export const signout = (req, res) => {
    res.status(200).json({ msg: 'User signed out successfully' });
};