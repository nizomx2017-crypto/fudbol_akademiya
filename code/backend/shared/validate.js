const { AppError } = require("./errors");
function validate(schema) { return (req, res, next) => {
  const errors = [];
  for (const [key, rules] of Object.entries(schema)) {
    const value = req.body?.[key];
    if (rules.required && (value === undefined || value === null || value === "")) errors.push(`${key} majburiy`);
    if (value !== undefined && rules.type && typeof value !== rules.type) errors.push(`${key} ${rules.type} bo'lishi kerak`);
    if (value !== undefined && rules.oneOf && !rules.oneOf.includes(value)) errors.push(`${key} noto'g'ri qiymat`);
  }
  if (errors.length) return next(new AppError(400, "Validation xatosi", "VALIDATION_ERROR", errors));
  next();
}; }
function pagination(query) { const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100); const page = Math.max(Number(query.page) || 1, 1); return { limit, offset: (page - 1) * limit, page }; }
module.exports = { validate, pagination };
