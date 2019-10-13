require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");

// routes
const userRoutes = require("../routes/userRoutes");

const middleWare = server => {
  server.use(express.json({ limit: "10mb" }));
  server.use(cors());
  server.use(helmet());
  server.use(morgan("dev"));
  server.use("/users", userRoutes);
};

module.exports = middleWare;
