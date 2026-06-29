const Payment = require("../models/paymentmodel");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["id", "ASC"]],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await Payment.update(req.body, {
      where: { id },
    });

    res.json({ message: "Payment updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await Payment.destroy({
      where: { id },
    });

    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
};