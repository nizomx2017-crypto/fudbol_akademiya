const express = require("express");
const requireAuthorization = require("../middleware/auth");
const AuthUser = require("../models/AuthUserModel");
const { hashPassword, verifyPassword } = require("../utils/password");

const router = express.Router();

function toPublicUser(user) {
  return {
    id: user.id,
    login: user.login,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await AuthUser.findOne({
      where: {
        login,
        status: "active",
      },
    });

    if (!user || !verifyPassword(password || "", user.passwordHash)) {
      return res.status(401).json({
        error: "Login yoki parol xato",
      });
    }

    return res.json({
      token: requireAuthorization.createSessionToken(),
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/users", requireAuthorization, async (req, res) => {
  try {
    const users = await AuthUser.findAll({
      order: [["id", "ASC"]],
    });

    res.json(users.map(toPublicUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users", requireAuthorization, async (req, res) => {
  const { login, password, status = "active" } = req.body;

  try {
    if (!login || !password) {
      return res.status(400).json({
        error: "Login va parol kiritilishi kerak",
      });
    }

    const user = await AuthUser.create({
      login,
      passwordHash: hashPassword(password),
      status,
    });

    res.json(toPublicUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/users/:id", requireAuthorization, async (req, res) => {
  const { id } = req.params;
  const { login, password, status } = req.body;

  try {
    const user = await AuthUser.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    if (login !== undefined) user.login = login;
    if (status !== undefined) user.status = status;
    if (password) user.passwordHash = hashPassword(password);

    await user.save();

    res.json(toPublicUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:id", requireAuthorization, async (req, res) => {
  const { id } = req.params;

  try {
    await AuthUser.destroy({
      where: { id },
    });

    res.json({ message: "Auth user deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
