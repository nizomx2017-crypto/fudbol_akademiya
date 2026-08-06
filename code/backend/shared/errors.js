class AppError extends Error {
  constructor(status, message, code = "APP_ERROR", details) {
    super(message); this.status = status; this.code = code; this.details = details;
  }
}
function notFound(req, res, next) { next(new AppError(404, "Endpoint topilmadi", "NOT_FOUND")); }
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "SequelizeValidationError" ? 400 : 500);
  const body = { error: { code: error.code || "INTERNAL_ERROR", message: status === 500 ? "Ichki server xatosi" : error.message } };
  if (error.details) body.error.details = error.details;
  if (status === 500 && process.env.NODE_ENV !== "test") console.error({ message: error.message, requestId: req.id });
  res.status(status).json(body);
}
module.exports = { AppError, notFound, errorHandler };
