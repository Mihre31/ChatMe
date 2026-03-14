import express from "express";
import messageRoutes from "../../backend/src/routes/message.route.js";

const app = express();

app.use("/", messageRoutes);

export default app;
