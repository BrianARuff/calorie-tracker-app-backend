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
  // error handler middleware
  server.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    switch (res.statusCode) {
      case 500:
        res
          .json({
            message: err.message,
            status: res.statusCode,
            info: "Server Error has Occurred"
          })
          .end();
      case 404:
        res
          .json({
            message: err.message,
            status: res.statusCode,
            info: "Resource or Resources were not Found"
          })
          .end();
      default:
        res.json({
          message: err.message,
          status: 500,
          info: "Default Error Message"
        });
    }
  });
};

module.exports = middleWare;
