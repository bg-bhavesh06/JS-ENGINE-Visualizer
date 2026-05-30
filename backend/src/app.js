const express = require("express");
const cors = require("cors");
const simulateRoute = require("./routes/simulateRoute");
const authRoute = require("./routes/authRoute");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "js-engine-visualizer-backend" });
});

app.use("/api/simulate", simulateRoute);
app.use("/api/auth", authRoute);

app.use((err, _req, res, _next) => {
  console.error("[server-error]", err);
  res.status(500).json({ message: "Something went wrong in simulation API." });
});

module.exports = app;
