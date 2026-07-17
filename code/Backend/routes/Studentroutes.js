const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/Studentcontroller");

router.get("/", requireAccess("students:view"), getStudents);
router.post("/", requireAccess("students:create"), createStudent);
router.put("/:id", requireAccess("students:update"), updateStudent);
router.delete("/:id", requireAccess("students:delete"), deleteStudent);

module.exports = router;
