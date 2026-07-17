const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
} = require("../controller/PaymentController");

router.get("/", requireAccess("payments:view"), getPayments);

router.post("/", requireAccess("payments:create"), createPayment);

router.put("/:id", requireAccess("payments:update"), updatePayment);

router.delete("/:id", requireAccess("payments:delete"), deletePayment);

module.exports = router;
