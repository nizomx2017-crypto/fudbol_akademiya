const crypto = require("crypto");

const activeSessions = new Set();

function createSessionToken() {
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.add(token);
  return token;
}

function requireAuthorization(req, res, next) {
  const authorization = req.get("Authorization");

  if (!authorization || !activeSessions.has(authorization)) {
    return res.status(401).json({
      error: "Authorization xato yoki yuborilmagan",
    });
  }

  return next();
}

requireAuthorization.createSessionToken = createSessionToken;

module.exports = requireAuthorization;
