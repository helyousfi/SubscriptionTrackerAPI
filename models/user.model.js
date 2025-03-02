import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username must be at most 30 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase : true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']   
    },
    age: {
        type: Number,
        min: [18, 'You must be at least 18 years old to register'],
        max: [120, 'You cannot be older than 120 years']
    },
    role : {
        type: String,
        enum: ['user', 'moderator', 'admin', 'superadmin'],
        default: 'user'
    },
    isConfirmed: { 
        type: 
        Boolean, 
        default: false 
    }
});

const User = mongoose.model('User', userSchema);

export default User;