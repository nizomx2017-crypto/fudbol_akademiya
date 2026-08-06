const { DataTypes } = require("sequelize");
const db = require("../config/db");

const AuthUser = db.define("auth_users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  refreshTokenHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  role: {
    type: DataTypes.ENUM("ADMIN", "DIRECTOR", "MANAGER", "TEACHER", "STUDENT"),
    allowNull: false,
    defaultValue: "MANAGER",
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = AuthUser;
