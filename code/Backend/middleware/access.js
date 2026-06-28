function hasFullAccess(user) {
  return user?.role === "ADMIN" || user?.role === "DIRECTOR";
}

function hasAccess(user, access) {
  if (hasFullAccess(user)) {
    return true;
  }

  return Boolean(user?.accesses?.includes(access));
}

function requireAccess(access) {
  return (req, res, next) => {
    if (hasAccess(req.user, access)) {
      return next();
    }

    return res.status(403).json({
      error: "Bu amal uchun access yo'q",
      requiredAccess: access,
    });
  };
}

function requireFullAccess(req, res, next) {
  if (hasFullAccess(req.user)) {
    return next();
  }

  return res.status(403).json({
    error: "Bu amal faqat ADMIN yoki DIRECTOR uchun",
  });
}

module.exports = {
  hasAccess,
  hasFullAccess,
  requireAccess,
  requireFullAccess,
};
