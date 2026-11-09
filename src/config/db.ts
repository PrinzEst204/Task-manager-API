import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGO_URI || '';
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Kill the server — no point running without a database
    }
};

export default connectDB