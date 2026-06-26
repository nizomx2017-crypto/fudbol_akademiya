const Group = require("../models/GroupModel");

const getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      order: [["id", "ASC"]],
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;

    await Group.update(req.body, {
      where: { id },
    });

    res.json({ message: "Group updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    await Group.destroy({
      where: { id },
    });

    res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};