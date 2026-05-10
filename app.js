const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectToDB = require("./db/dbService");
const chalk = require('chalk');
const authRoutes = require("./routes/authRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const recordRoutes = require("./routes/recordRoutes");
// const corsMiddleware = require("./middlewere/corsMiddleware");
// app.use(corsMiddleware);

dotenv.config();

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api", fieldRoutes);
app.use("/api", recordRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 8181;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});