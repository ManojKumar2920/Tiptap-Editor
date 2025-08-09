import mongoose, { Connection } from "mongoose";

// Cached connection to avoid multiple connections
let cachedConnection: Connection | null = null;

export async function connectDB() {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const cnx = await mongoose.connect(uri, {
      bufferCommands: true,
    });

    cachedConnection = cnx.connection;
    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function getNativeClient() {
    const conn = await connectDB();

    return conn.getClient().db();
}