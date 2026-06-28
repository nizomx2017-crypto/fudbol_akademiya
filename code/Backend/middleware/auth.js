const jwt = require("jsonwebtoken");
const AuthUser = require("../models/AuthUserModel");
const Access = require("../models/AccessModel");
const UserAccess = require("../models/UserAccessModel");

const DEFAULT_JWT_EXPIRES_IN = "8h";

function getJwtSecret() {
  return process.env.JWT_SECRET || "development-only-change-me";
}

function createSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN,
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

requireAuthorization.createSessionToken = createSessionToken;

module.exports = requireAuthorization;
