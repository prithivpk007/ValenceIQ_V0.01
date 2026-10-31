import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/apiRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Mount API Routes
app.use("/api/v1", apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "ValenceIQ Financial Analyst API",
    version: "1.0.0",
    docs: "/api/v1/health",
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[ValenceIQ API] Server running on http://localhost:${PORT}`);
    console.log(`[ValenceIQ API] Health check at http://localhost:${PORT}/api/v1/health`);
  });
}

export default app;
