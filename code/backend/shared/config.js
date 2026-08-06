const { AppError } = require("./errors");
function assertProductionConfig() {
  if (process.env.NODE_ENV !== "production") return;
  const weak = [undefined, "", "development-only-change-me", "change_this_to_a_long_random_secret"];
  if (weak.includes(process.env.JWT_SECRET) || weak.includes(process.env.JWT_REFRESH_SECRET)) throw new AppError(500, "Production JWT secret sozlanmagan", "CONFIG_ERROR");
  if (process.env.DB_FORCE_SYNC === "true") throw new AppError(500, "DB_FORCE_SYNC productionda taqiqlangan", "CONFIG_ERROR");
}
module.exports = { assertProductionConfig };
