import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

export default connectDB;