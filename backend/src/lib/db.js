import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("MONGO CONNECTED: ", conn.connection.host);
    return conn;
  } catch (error) {
    const whitelistHint =
      error?.name === "MongooseServerSelectionError"
        ? "\nCheck Atlas Network Access and add your current IP address."
        : "";

    console.error(
      `Error connecting to MongoDB: ${error.message}${whitelistHint}`
    );
    throw error;
  }
};
