import express from "express";
import authRoutes from "../../backend/src/routes/auth.route.js";

const app = express();

app.use("/", authRoutes);

export default app;
