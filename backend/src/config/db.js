import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/vessel_optimization';
    await mongoose.connect(connStr);
    console.log(`Connected to MongoDB successfully: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}
