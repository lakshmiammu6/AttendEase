const mongoose = require('mongoose');

/**
 * connectDB: Establishes a connection to the MongoDB database.
 * Uses MONGO_URI from the environment variables (.env).
 * Exits the process with failure (code 1) if connection cannot be established.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables. Check your .env file.');
    }

    const conn = await mongoose.connect(mongoUri, {
      // Modern mongoose options are enabled by default in Mongoose 6+
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
