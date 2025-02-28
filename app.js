// Import necessary modules
import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/users.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

// Create an express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // process form data
app.use(errorMiddleware);
app.use(cookieParser());


// Routes
app.use(arcjetMiddleware);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Subscription tracker app listening on port http://localhost:${PORT}`);
    await connectToDatabase();
})

// Export the app
export default app;