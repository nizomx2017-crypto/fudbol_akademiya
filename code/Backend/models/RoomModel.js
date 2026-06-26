const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Room = db.define("rooms", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  equipment: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Room;