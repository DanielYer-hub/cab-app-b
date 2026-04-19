const mongoose = require("mongoose");

require("dotenv").config();

const connectionStringForAtlas = process.env.MONGO_ATLAS_URI;

const connectToAtlasDB = async () => {
  try {
    await mongoose.connect(connectionStringForAtlas);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB Atlas connection failed", error);
    process.exit(1); 
  }
};

module.exports = connectToAtlasDB;