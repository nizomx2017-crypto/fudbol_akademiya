const Course = require("../models/coursemodel");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [["id", "ASC"]],
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await Course.update(req.body, {
      where: { id },
    });

    res.json({ message: "Course updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await Course.destroy({
      where: { id },
    });

    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};