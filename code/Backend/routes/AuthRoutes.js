const express = require("express");
const requireAuthorization = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;
  const loginPassword = process.env.LOGIN_PASSWORD;

  if (!loginPassword) {
    return res.status(500).json({
      error: "Login paroli sozlanmagan",
    });
  }

  if (password !== loginPassword) {
    return res.status(401).json({
      error: "Parol xato",
    });
  }

  return res.json({
    token: requireAuthorization.createSessionToken(),
  });
});

module.exports = router;
