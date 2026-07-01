import mongoose from 'mongoose'
import 'dotenv/config';

export const connectToMongoDB = async () => {
  try {
    // Accessing the URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected: Food_Del");
  } catch (err) {
    console.error("❌ Connection Error:", err.message); 
  }
};