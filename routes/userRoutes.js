const router = require("express").Router();

router.get("/", (req, res, next) => {
  if (1 === 1) {
    res.status(200).json({ message: "Users Success" });
  } else {
    next(new Error("Invalid Users Request"));
  }
});

module.exports = router;
