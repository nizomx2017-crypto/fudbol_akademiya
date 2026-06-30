const rateLimit = require("express-rate-limit");

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function readPositiveInteger(name, fallback) {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function createLimiter({ windowEnv, maxEnv, defaultMax, message }) {
  return rateLimit({
    windowMs: readPositiveInteger(windowEnv, FIFTEEN_MINUTES_MS),
    max: readPositiveInteger(maxEnv, defaultMax),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: message,
    },
  });
}

const loginRateLimiter = createLimiter({
  windowEnv: "LOGIN_RATE_LIMIT_WINDOW_MS",
  maxEnv: "LOGIN_RATE_LIMIT_MAX",
  defaultMax: 5,
  message: "Juda ko'p login urinishlari. 15 daqiqadan keyin qayta urinib ko'ring.",
});

const registerRateLimiter = createLimiter({
  windowEnv: "REGISTER_RATE_LIMIT_WINDOW_MS",
  maxEnv: "REGISTER_RATE_LIMIT_MAX",
  defaultMax: 5,
  message: "Juda ko'p register urinishlari. 15 daqiqadan keyin qayta urinib ko'ring.",
});

const apiRateLimiter = createLimiter({
  windowEnv: "API_RATE_LIMIT_WINDOW_MS",
  maxEnv: "API_RATE_LIMIT_MAX",
  defaultMax: 100,
  message: "Juda ko'p so'rov yuborildi. 15 daqiqadan keyin qayta urinib ko'ring.",
});

module.exports = {
  apiRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
};
