const express = require("express");
const requireAuthorization = require("../middleware/auth");

const router = express.Router();

function getLoginAccounts() {
  const accounts = [];

  Object.keys(process.env)
    .filter((key) => /^LOGIN_USER_\d+$/.test(key))
    .map((key) => key.split("_").pop())
    .sort((a, b) => Number(a) - Number(b))
    .forEach((index) => {
      const login = process.env[`LOGIN_USER_${index}`]?.trim();
      const password = process.env[`LOGIN_PASSWORD_${index}`]?.trim();

      if (login && password) {
        accounts.push({ login, password });
      }
    });

  return accounts;
}

router.post("/login", (req, res) => {
  const { login, password } = req.body;
  const loginAccounts = getLoginAccounts();

  if (loginAccounts.length === 0) {
    return res.status(500).json({
      error: "Login sozlamalari kiritilmagan",
    });
  }

  const isValidAccount = loginAccounts.some(
    (account) => account.login === login && account.password === password
  );

  if (!isValidAccount) {
    return res.status(401).json({
      error: "Login yoki parol xato",
    });
  }

  return res.json({
    token: requireAuthorization.createSessionToken(),
  });
});

module.exports = router;
