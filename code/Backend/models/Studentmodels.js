const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Student = db.define("students", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  group: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  balance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  joined: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Student;