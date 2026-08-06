const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Role = db.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.ENUM("ADMIN", "DIRECTOR", "MANAGER", "TEACHER", "STUDENT"),
    allowNull: false,
    unique: true,
  },
});

module.exports = Role;
