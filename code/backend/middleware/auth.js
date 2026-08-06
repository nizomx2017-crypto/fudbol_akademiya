const jwt = require("jsonwebtoken");
const AuthUser = require("../models/AuthUserModel");
const Access = require("../models/AccessModel");
const UserAccess = require("../models/UserAccessModel");

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = "10m";
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = "7d";

function getJwtSecret() {
  return process.env.JWT_SECRET || "development-only-change-me";
}

function getRefreshJwtSecret() {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
}

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      type: "access",
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh",
    },
    getRefreshJwtSecret(),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
    }
  );
}

async function loadUserWithAccesses(userId) {
  return AuthUser.findByPk(userId, {
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

async function requireAuthorization(req, res, next) {
  const authorization = req.get("Authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : authorization;

  if (!token) {
    return res.status(401).json({
      error: "Authorization xato yoki yuborilmagan",
    });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.type && payload.type !== "access") {
      return res.status(401).json({
        error: "Token yaroqsiz yoki muddati tugagan",
      });
    }

    const user = await loadUserWithAccesses(payload.sub);

    if (!user || user.status !== "active") {
      return res.status(401).json({
        error: "Foydalanuvchi aktiv emas yoki topilmadi",
      });
    }

    req.user = {
      id: user.id,
      login: user.login,
      role: user.role,
      status: user.status,
      accesses: user.userAccesses?.map((item) => item.access?.name).filter(Boolean) || [],
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token yaroqsiz yoki muddati tugagan",
    });
  }
}

requireAuthorization.createAccessToken = createAccessToken;
requireAuthorization.createRefreshToken = createRefreshToken;
requireAuthorization.getRefreshJwtSecret = getRefreshJwtSecret;
requireAuthorization.loadUserWithAccesses = loadUserWithAccesses;

module.exports = requireAuthorization;
