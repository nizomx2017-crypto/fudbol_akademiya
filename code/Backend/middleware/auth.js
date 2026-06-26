const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN || "Alisher@123";

function requireAuthorization(req, res, next) {
  const authorization = req.get("Authorization");

  if (authorization !== API_AUTH_TOKEN) {
    return res.status(401).json({
      error: "Authorization xato yoki yuborilmagan",
    });
  }

  return next();
}

module.exports = requireAuthorization;
