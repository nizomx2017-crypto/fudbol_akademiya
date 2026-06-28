const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Access = db.define("accesses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Access;
