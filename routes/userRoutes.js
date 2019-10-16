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

router.get("/name/:username", async (req, res, next) => {
  const { username } = req.params;
  console.log(username);
  try {
    const user = await database.query(
      "select * from users where username = $1;",
      [username]
    );

    if (!Object(user.rows[0]).hasOwnProperty("id")) {
      next(new Error("User record not found"));
    }
    const limitedUserData = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      age: user.rows[0].age,
      height: user.rows[0].height,
      starting_weight: user.rows[0].starting_weight,
      current_weight: user.rows[0].current_weight,
      goal_weight: user.rows[0].goal_weight
    };
    res.status(200).json(limitedUserData);
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
