const Room = require("../models/RoomModel");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      order: [["id", "ASC"]],
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    await Room.update(req.body, {
      where: { id },
    });

    res.json({ message: "Room updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    await Room.destroy({
      where: { id },
    });

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};