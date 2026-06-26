const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Group = db.define("groups", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  course: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  teacher: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  students: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  schedule: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  room: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Group;