const express = require("express");
const router = express.Router();

const {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
} = require("../controller/PaymentController");

router.get("/", getPayments);

router.post("/", createPayment);

router.put("/:id", updatePayment);

router.delete("/:id", deletePayment);

module.exports = router;