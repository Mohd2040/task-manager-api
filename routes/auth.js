const express = require("express");
const router = express.Router();

// مؤقتًا فقط لتجنب الكراش
router.get("/", (req, res) => {
  res.send("Auth route working!");
});

module.exports = router;
