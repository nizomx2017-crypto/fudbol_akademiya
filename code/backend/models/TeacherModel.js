const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Teacher = db.define("teachers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Teacher;