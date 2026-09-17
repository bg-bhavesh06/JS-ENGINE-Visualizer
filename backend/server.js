const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");

const simulateRoute = require("./src/routes/simulateRoute");
const authRoute = require("./src/routes/authRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "js-engine-visualizer-backend" });
});

// Routes
app.use("/api/simulate", simulateRoute);
app.use("/api/auth", authRoute);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error("[server-error]", err);
  res.status(500).json({ message: "Something went wrong in simulation API." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`JS Engine Visualizer backend running on port ${PORT}`);
});


