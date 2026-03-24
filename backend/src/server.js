//const express = require("express")
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); //req.body

const __dirname = path.resolve();
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready to deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });
  } catch (error) {
    console.error(
      "Server startup aborted because the database is unavailable.",
    );
    process.exit(1);
  }
};

startServer();
