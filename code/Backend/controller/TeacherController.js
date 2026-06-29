const Teacher = require("../models/teachermodel");

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [["id", "ASC"]],
    });

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    await Teacher.update(req.body, {
      where: { id },
    });

    res.json({ message: "Teacher updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    await Teacher.destroy({
      where: { id },
    });

    res.json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};