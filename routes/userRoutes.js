require("dotenv").config();

const router = require("express").Router();
const database = require("../db/database");
const validator = require("validator");

router.get("/", async (req, res, next) => {
  const { limit, offset } = req.query;
  try {
    const users = await database.query(
      `select * from users order by created_at desc limit $1 offset $2;`,
      [limit, offset]
    );
    res.status(200).json(users.rows);
  } catch (error) {
    next(new Error(error));
  }
});

router.post("/", async (req, res, next) => {
  const {
    username,
    password,
    email,
    age,
    height,
    starting_weight,
    current_weight,
    goal_weight
  } = req.body;
  try {
    if (
      username &&
      password &&
      validator.isEmail(email) &&
      age &&
      height &&
      starting_weight &&
      starting_weight &&
      goal_weight
    ) {
      await database.query(
        "INSERT INTO users (username, password, email, age, height, starting_weight, goal_weight, current_weight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          username,
          password,
          email,
          age,
          height,
          starting_weight,
          goal_weight,
          current_weight
        ]
      );
      res.status(200).json({
        username,
        password,
        email,
        age,
        height,
        starting_weight,
        goal_weight,
        current_weight
      });
    } else {
      next(
        new Error(
          "Please ensure that you provided a username, password, email, age, height, your starting and goal weight to continue."
        )
      );
    }
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = router;
