require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// routes
const userRoutes = require("../routes/userRoutes");
const authRoutes = require("../routes/authRoutes");

const middleWare = server => {
  // session setup
  server.use(express.json({ limit: "10mb" }));
  server.use(cors());
  server.use(cookieParser());
  server.use(
    session({
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      secret: process.env.COOKIE_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );
  server.use(helmet());
  server.use(morgan("dev"));
  server.use("/users", userRoutes);
  server.use("/auth", authRoutes);
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
