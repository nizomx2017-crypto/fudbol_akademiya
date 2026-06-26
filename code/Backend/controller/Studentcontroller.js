const Student = require("../models/Studentmodels");

const getStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const students = await Student.findAndCountAll({
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    res.json({
      total: students.count,
      page,
      limit,
      data: students.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await Student.update(req.body, {
      where: { id },
    });

    res.json({ message: "Student updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await Student.destroy({
      where: { id },
    });

    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};