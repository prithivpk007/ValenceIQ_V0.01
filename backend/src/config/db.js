import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/valenceiq");
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    // Don't exit in development if DB is optional or offline during local dev
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};
