const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Users Success" });
});

module.exports = router;
