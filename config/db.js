//config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // TODO: Remove useNewUrlParser and useUnifiedTopology options when upgrading to Mongoose 6.0 or later
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Suppress deprecation warnings
    mongoose.set('strictQuery', true);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;