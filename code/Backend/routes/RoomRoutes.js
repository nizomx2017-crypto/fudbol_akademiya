const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
} = require("../controller/RoomController");

router.get("/", requireAccess("rooms:view"), getRooms);

router.post("/", requireAccess("rooms:create"), createRoom);

router.put("/:id", requireAccess("rooms:update"), updateRoom);

router.delete("/:id", requireAccess("rooms:delete"), deleteRoom);

module.exports = router;
