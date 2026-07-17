const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const requireAuthorization = require("../middleware/auth");
const { requireFullAccess } = require("../middleware/access");
const { loginRateLimiter, registerRateLimiter } = require("../middleware/rateLimit");
const AuthUser = require("../models/AuthUserModel");
const Access = require("../models/AccessModel");
const UserAccess = require("../models/UserAccessModel");
const { hashPassword, verifyPassword } = require("../utils/password");
const { ACCESS_CATALOG } = require("../constants/accessCatalog");
const { DEFAULT_ROLE_ACCESSES } = require("../constants/roleAccessDefaults");
const ROLE_TYPES = ["ADMIN", "DIRECTOR", "MANAGER", "TEACHER", "STUDENT"];
const LOGIN_LOCK_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;
const INVALID_LOGIN_MESSAGE = "Login yoki parol noto'g'ri";
const LOGIN_PATTERN = /^[a-zA-Z0-9._-]+$/;
const USER_STATUSES = ["active", "inactive"];
const loginFailures = new Map();

const router = express.Router();

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function normalizeLogin(login) {
  return String(login || "").trim().toLowerCase();
}

function isLoginLocked(loginKey) {
  const state = loginFailures.get(loginKey);

  if (!state?.lockedUntil) {
    return false;
  }

  if (state.lockedUntil <= Date.now()) {
    loginFailures.delete(loginKey);
    return false;
  }

  return true;
}

function recordFailedLogin(loginKey) {
  if (!loginKey) {
    return false;
  }

  const now = Date.now();
  const current = loginFailures.get(loginKey);
  const attempts =
    current && current.expiresAt > now ? current.attempts + 1 : 1;
  const nextState = {
    attempts,
    expiresAt: now + LOGIN_LOCK_WINDOW_MS,
    lockedUntil:
      attempts >= LOGIN_LOCK_MAX_ATTEMPTS ? now + LOGIN_LOCK_WINDOW_MS : null,
  };

  loginFailures.set(loginKey, nextState);

  return Boolean(nextState.lockedUntil);
}

function resetFailedLogin(loginKey) {
  if (loginKey) {
    loginFailures.delete(loginKey);
  }
}

function isRecaptchaDisabled() {
  return process.env.NODE_ENV !== "production" && process.env.DISABLE_RECAPTCHA === "true";
}

async function verifyRecaptcha(captchaToken) {
  if (isRecaptchaDisabled()) {
    return true;
  }

  if (!captchaToken) {
    return false;
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return false;
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret,
      response: captchaToken,
    }),
  });
  const body = await response.json();

  return Boolean(body.success);
}

function validateAuthUserPayload(payload) {
  const errors = [];
  const login = String(payload.login || "").trim();
  const password = String(payload.password || "");
  const role = payload.role || "MANAGER";
  const status = payload.status || "active";

  if (!login) {
    errors.push("Login kiritilishi kerak");
  } else if (login.length > 80) {
    errors.push("Login 80 ta belgidan oshmasligi kerak");
  } else if (!LOGIN_PATTERN.test(login)) {
    errors.push("Login faqat harf, raqam, nuqta, tire va pastki chiziqdan iborat bo'lishi kerak");
  }

  if (!password) {
    errors.push("Parol kiritilishi kerak");
  } else if (password.length < 8) {
    errors.push("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
  } else if (password.length > 128) {
    errors.push("Parol 128 ta belgidan oshmasligi kerak");
  }

  if (!ROLE_TYPES.includes(role)) {
    errors.push("Role noto'g'ri");
  }

  if (!USER_STATUSES.includes(status)) {
    errors.push("Status noto'g'ri");
  }

  if (payload.accesses !== undefined && !Array.isArray(payload.accesses)) {
    errors.push("Accesses array bo'lishi kerak");
  }

  return {
    errors,
    values: {
      login,
      password,
      role,
      status,
    },
  };
}

function toPublicUser(user) {
  return {
    id: user.id,
    login: user.login,
    role: user.role,
    status: user.status,
    accesses: user.userAccesses?.map((item) => item.access?.name).filter(Boolean) || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

router.post("/login", loginRateLimiter, async (req, res) => {
  const { login, password, captchaToken } = req.body;
  const loginKey = normalizeLogin(login);

  if (isLoginLocked(loginKey)) {
    return res.status(423).json({
      error: "Login vaqtincha bloklangan. 15 daqiqadan keyin qayta urinib ko'ring.",
    });
  }

  try {
    const isCaptchaValid = await verifyRecaptcha(captchaToken);

    if (!isCaptchaValid) {
      return res.status(400).json({
        error: "Captcha tekshiruvidan o'tmadi",
      });
    }

    const user = await AuthUser.findOne({
      where: {
        login,
        status: "active",
      },
      include: [
        {
          model: UserAccess,
          as: "userAccesses",
          include: [
            {
              model: Access,
              as: "access",
            },
          ],
        },
      ],
    });

    if (!user || !verifyPassword(password || "", user.passwordHash)) {
      const isLocked = recordFailedLogin(loginKey);

      return res.status(isLocked ? 423 : 401).json({
        error: isLocked
          ? "Login vaqtincha bloklangan. 15 daqiqadan keyin qayta urinib ko'ring."
          : INVALID_LOGIN_MESSAGE,
      });
    }

    resetFailedLogin(loginKey);

    const accessToken = requireAuthorization.createAccessToken(user);
    const refreshToken = requireAuthorization.createRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    return res.json({
      token: accessToken,
      accessToken,
      refreshToken,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: "Refresh token yuborilishi kerak",
    });
  }

  try {
    const payload = jwt.verify(refreshToken, requireAuthorization.getRefreshJwtSecret());

    if (payload.type !== "refresh") {
      return res.status(401).json({
        error: "Refresh token yaroqsiz yoki muddati tugagan",
      });
    }

    const user = await AuthUser.findByPk(payload.sub);

    if (
      !user ||
      user.status !== "active" ||
      !user.refreshTokenHash ||
      user.refreshTokenHash !== hashToken(refreshToken)
    ) {
      return res.status(401).json({
        error: "Refresh token yaroqsiz yoki muddati tugagan",
      });
    }

    const accessToken = requireAuthorization.createAccessToken(user);
    const nextRefreshToken = requireAuthorization.createRefreshToken(user);
    user.refreshTokenHash = hashToken(nextRefreshToken);
    await user.save();

    return res.json({
      token: accessToken,
      accessToken,
      refreshToken: nextRefreshToken,
    });
  } catch {
    return res.status(401).json({
      error: "Refresh token yaroqsiz yoki muddati tugagan",
    });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.json({ message: "Logged out" });
  }

  try {
    const payload = jwt.verify(refreshToken, requireAuthorization.getRefreshJwtSecret());
    const user = await AuthUser.findByPk(payload.sub);

    if (user && user.refreshTokenHash === hashToken(refreshToken)) {
      user.refreshTokenHash = null;
      await user.save();
    }
  } catch {
    // Logout must stay idempotent even when the client has an old token.
  }

  return res.json({ message: "Logged out" });
});

router.get("/me", requireAuthorization, async (req, res) => {
  res.json({ user: req.user });
});

router.get("/users", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const users = await AuthUser.findAll({
      include: [
        {
          model: UserAccess,
          as: "userAccesses",
          include: [
            {
              model: Access,
              as: "access",
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(users.map(toPublicUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/users",
  registerRateLimiter,
  requireAuthorization,
  requireFullAccess,
  async (req, res) => {
    const { errors, values } = validateAuthUserPayload(req.body);
    const { login, password, role, status } = values;

    try {
      if (errors.length > 0) {
        return res.status(400).json({
          error: "Validation xato",
          details: errors,
        });
      }

      const existingUser = await AuthUser.findOne({
        where: {
          login,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          error: "Bunday login allaqachon mavjud",
        });
      }

      const user = await AuthUser.create({
        login,
        passwordHash: hashPassword(password),
        role,
        status,
      });

      if (!["ADMIN", "DIRECTOR"].includes(role)) {
        await setUserAccesses(user.id, getRoleAccesses(role, req.body.accesses));
      }

      const createdUser = await findUserWithAccesses(user.id);
      res.json(toPublicUser(createdUser));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/users/:id", requireAuthorization, requireFullAccess, async (req, res) => {
  const { id } = req.params;
  const { login, password, role, status, accesses } = req.body;

  try {
    const user = await AuthUser.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    if (login !== undefined) user.login = login;
    if (status !== undefined) user.status = status;
    if (role !== undefined) {
      if (!ROLE_TYPES.includes(role)) {
        return res.status(400).json({
          error: "Role noto'g'ri",
        });
      }

      user.role = role;
    }
    if (password) user.passwordHash = hashPassword(password);

    await user.save();

    if (Array.isArray(accesses)) {
      await setUserAccesses(
        user.id,
        ["ADMIN", "DIRECTOR"].includes(user.role) ? [] : accesses
      );
    }

    const updatedUser = await findUserWithAccesses(user.id);
    res.json(toPublicUser(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:id", requireAuthorization, requireFullAccess, async (req, res) => {
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

router.get("/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const accesses = await Access.findAll({
      order: [
        ["resource", "ASC"],
        ["action", "ASC"],
      ],
    });

    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users/:id/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  try {
    const user = await findUserWithAccesses(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    res.json({
      user: toPublicUser(user),
      catalog: ACCESS_CATALOG,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/users/:id/accesses", requireAuthorization, requireFullAccess, async (req, res) => {
  const { accesses = [] } = req.body;

  try {
    const user = await AuthUser.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User topilmadi",
      });
    }

    if (user.role === "ADMIN" || user.role === "DIRECTOR") {
      await UserAccess.destroy({ where: { userId: user.id } });
      const updatedUser = await findUserWithAccesses(user.id);
      return res.json(toPublicUser(updatedUser));
    }

    await setUserAccesses(user.id, accesses);
    const updatedUser = await findUserWithAccesses(user.id);
    res.json(toPublicUser(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function findUserWithAccesses(id) {
  return AuthUser.findByPk(id, {
    include: [
      {
        model: UserAccess,
        as: "userAccesses",
        include: [
          {
            model: Access,
            as: "access",
          },
        ],
      },
    ],
  });
}

async function setUserAccesses(userId, accessNames) {
  const uniqueAccessNames = [...new Set(accessNames)].filter((name) =>
    ACCESS_CATALOG.includes(name)
  );

  const accesses = await Access.findAll({
    where: {
      name: uniqueAccessNames,
    },
  });

  await UserAccess.destroy({
    where: {
      userId,
    },
  });

  await Promise.all(
    accesses.map((access) =>
      UserAccess.create({
        userId,
        accessId: access.id,
      })
    )
  );
}

function getRoleAccesses(role, accesses) {
  if (Array.isArray(accesses)) {
    return accesses;
  }

  return DEFAULT_ROLE_ACCESSES[role] || [];
}

module.exports = router;
