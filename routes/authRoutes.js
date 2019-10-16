require("dotenv").config();

const router = require("express").Router();
const database = require("../db/database");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const sendEmail = require("../mail/SMTP_Transporter");

router.post("/register", async (req, res, next) => {
  const {
    username,
    email,
    age,
    height,
    starting_weight,
    current_weight,
    goal_weight
  } = req.body;

  let { password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  password = hash;

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
        "INSERT INTO users (username, password, email, age, height, starting_weight, goal_weight, current_weight, isauthenticated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          username,
          password,
          email,
          age,
          height,
          starting_weight,
          goal_weight,
          current_weight,
          false
        ]
      );
      if (sendEmail(email, username, starting_weight, goal_weight)) {
        res.status(200).json({
          username,
          password,
          email,
          age,
          height,
          starting_weight,
          goal_weight,
          current_weight,
          isauthenticated: false
        });
      } else {
        next(new Error("Account was not created"));
      }
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

router.patch("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await database.query(
      "select * from users where username = $1",
      [username]
    );
    if (!user) {
      next(new Error("Invalid Username"));
    } else {
      if (await bcrypt.compare(password, user.rows[0].password)) {
        if (users.rows[0].isauthenticated) {
          const userAfterUpdate = await database.query(
            "select * from users where username = $1",
            [username]
          );
          res.status(200).json({ user: userAfterUpdate.rows[0] });
        } else {
          next(
            new Error(
              "This account was not validated. Please check your email and validate your account"
            )
          );
        }
      } else {
        next(new Error("Invalid Password"));
      }
    }
  } catch (error) {
    next(new Error(error));
  }
});

router.patch("/logout", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await database.query(
      "select * from users where username = $1",
      [username]
    );
    if (!user) {
      next(new Error("Invalid Username"));
    } else {
      if (await bcrypt.compare(password, user.rows[0].password)) {
        await database.query(
          "UPDATE users SET isAuthenticated = $1 WHERE users.username = $2",
          [false, username]
        );
        const userAfterUpdate = await database.query(
          "select * from users where username = $1",
          [username]
        );
        res.status(200).json({ user: userAfterUpdate.rows[0] });
      } else {
        next(new Error("Invalid Password"));
      }
    }
  } catch (error) {
    next(new Error(error));
  }
});

router.post("/validate", async (req, res, next) => {
  const { username } = req.body;
  console.log(req.body.username);
  try {
    await database.query(
      "UPDATE users SET isauthenticated = $1 WHERE username = $2",
      [true, username]
    );
    const user = await database.query(
      "select * from users where username = $1",
      [username]
    );
    res.status(200).json({
      message: `${username} account authorized`,
      isauthenticated: user.rows[0].isauthenticated
    });
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = router;
