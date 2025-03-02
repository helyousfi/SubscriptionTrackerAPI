import mongoose, { mongo } from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";
import { MongoMemoryServer } from "mongodb-memory-server";

if(!DB_URI)
{
    throw new Error("Missing database connection string. Please define the 'DB_URI' environment variable.");
}

// Connect to the database
const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`Successfully connected to the database (${NODE_ENV} mode)`);
    }
    catch (error) {
        console.log(DB_URI);
        console.error("Failed to connect to the database:", error.message);
        process.exit(1);
    }
}

export default connectToDatabase;