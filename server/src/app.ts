import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { userRoutes, authRoutes } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS middleware
app.use(
  cors({
    origin: [
      "https://user-mgt-system.netlify.app", // Production frontend URL
      "http://localhost:5173", // Vite local dev server
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

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
