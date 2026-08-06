const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Payment = db.define("payments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  student: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },

  method: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Payment;
