const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require("../controller/TeacherController");

router.get("/", requireAccess("teachers:view"), getTeachers);

router.post("/", requireAccess("teachers:create"), createTeacher);

router.put("/:id", requireAccess("teachers:update"), updateTeacher);

router.delete("/:id", requireAccess("teachers:delete"), deleteTeacher);

module.exports = router;
