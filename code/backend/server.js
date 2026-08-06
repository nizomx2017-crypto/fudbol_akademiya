const app = require("./app");
const db = require("./config/db");
const seedAuthUsers = require("./models/seedAuthUsers");
const { assertProductionConfig } = require("./shared/config");

const PORT = process.env.PORT || 5000;
assertProductionConfig();
const forceSync = process.env.NODE_ENV !== "production" && process.env.DB_FORCE_SYNC === "true";

db.sync({ force: forceSync })
  .then(() => seedAuthUsers())
  .then(() => {
    console.log("Database jadvali yaratildi");
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portda ishladi`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
