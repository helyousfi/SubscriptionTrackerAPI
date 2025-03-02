import mongoose from 'mongoose';
import { JWT_SECRET, 
    JWT_EXPIRE_IN, 
    ADMIN_SECRET_KEY, 
    MODERATOR_SECRET_KEY,
    SUPERADMIN_SECRET_KEY } from '../config/env.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from '../utils/sendConfirmationEmail.js'
import { sendPasswordResetEmail } from '../utils/sendPasswordResetEmail.js';

// Sign Up
export const signup = async (req, res, next) => {
    // Start a session to handle transactions
    const session = await mongoose.startSession();

    // Start the transaction
    session.startTransaction();

    try {
        const { username, email, password, age, adminKey } = req.body;

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

        // Set default role
        let role = 'user';

        // If adminKey is correct, upgrade role to "admin"
        if (adminKey && adminKey === ADMIN_SECRET_KEY) {
            role = 'admin';
        } else if (adminKey && adminKey === MODERATOR_SECRET_KEY) {
            role = 'moderator';
        } else if (adminKey && adminKey === SUPERADMIN_SECRET_KEY) {
            role = 'superadmin';
        }
        
        

        // Create new user with correct role
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            age,
            role // Set the role properly
        });

        // Save the new user within the transaction
        await newUser.save({ session });

        // Generate token
        // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });

        // Generate confirmation token
        const confirmationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationToken);

        // Commit the transaction
        await session.commitTransaction();

        // Respond with the token and user data
        res.status(201).json({
            success: true,
            message: 'User created. Please check your email to confirm your subscription.',
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
        
        // Check if email is confirmed
        if (!user.isConfirmed) {
            return res.status(403).json({ success: false, message: "Please confirm your email before logging in." });
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

// Confirm User
export const confirmUser = async (req, res) => {
    try {
        const { token } = req.query;
        if(!token) {
            return res.status(400).json({
                success: false,
                message: 'No token provided'
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOneAndUpdate(
            { email: decoded.email },
            { isConfirmed: true },
            { new: true }
        );
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token or user not found.' });
        }
        res.send('Subscription confirmed! You can now log in.');
    } catch (error) {
        res.status(400).send('Invalid or expired token.');
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate a password reset token (valid for 1 hour)
        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Send password reset email
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user by email
        const user = await User.findOne({ email: decoded.email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const showResetPasswordForm = (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verify the token to ensure it's valid
        const decoded = jwt.verify(token, JWT_SECRET);

        // If token is valid, render the form or send a success message
        res.status(200).json({
            success: true,
            message: 'Valid token. Proceed to reset your password.',
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};
