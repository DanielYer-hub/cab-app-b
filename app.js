const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectToDB = require("./db/dbService");
const chalk = require('chalk');

dotenv.config();

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 8181;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});