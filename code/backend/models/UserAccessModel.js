const { DataTypes } = require("sequelize");
const db = require("../config/db");

const UserAccess = db.define("user_accesses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  accessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ["userId", "accessId"],
    },
  ],
});

module.exports = UserAccess;
