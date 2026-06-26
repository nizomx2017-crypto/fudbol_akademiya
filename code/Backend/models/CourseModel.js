const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Course = db.define("courses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Course;