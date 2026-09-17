// Mongoose Package
const mongoose = require("mongoose");

// Mongoose Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/JSLAB"
    );
    console.log(`MongoDB is Connected ${conn.connection.host}`);
    // with "connection.host " we get local mongodb is connected or Atls is connected
  } catch (err) {
    console.error(`MongoDB is Not Connected ${err.message}`);
  }
};

module.exports = { connectDB };
