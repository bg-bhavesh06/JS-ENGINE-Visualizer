const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

const app = require("./src/app");
const PORT = process.env.PORT || 5000;

const DB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/js-engine-visualizer";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`JS Engine Visualizer backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    app.listen(PORT, () => {
      console.log(
        `JS Engine Visualizer backend running on port ${PORT} (Database unavailable)`,
      );
    });
  });
