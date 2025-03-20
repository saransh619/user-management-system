import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { userRoutes, authRoutes } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("API is working perfectly fine!");
});

// Routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);

export default app;
