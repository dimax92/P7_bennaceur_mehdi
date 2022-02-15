const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const app = express();
const apiRoutes = require("./routes/groupomania");
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", apiRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});

app.use(helmet());