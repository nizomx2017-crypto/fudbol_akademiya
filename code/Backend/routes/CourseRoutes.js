const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controller/CourseController");

router.get("/", requireAccess("courses:view"), getCourses);

router.post("/", requireAccess("courses:create"), createCourse);

router.put("/:id", requireAccess("courses:update"), updateCourse);

router.delete("/:id", requireAccess("courses:delete"), deleteCourse);

module.exports = router;
    