const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Task list here." });
});

module.exports = router;
