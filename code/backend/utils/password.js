const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, originalHash] = passwordHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHash, "hex");

  return original.length === hash.length && crypto.timingSafeEqual(original, hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
