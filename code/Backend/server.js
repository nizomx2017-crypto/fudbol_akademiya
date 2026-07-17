const app = require("./app");
const db = require("./config/db");
const seedAuthUsers = require("./models/seedAuthUsers");

const PORT = process.env.PORT || 5000;
const forceSync = process.env.DB_FORCE_SYNC === "true";

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
