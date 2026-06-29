const express = require("express");
const router = express.Router();
const { requireAccess } = require("../middleware/access");

const {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup
} = require("../controller/groupcontroller");

router.get("/", requireAccess("groups:view"), getGroups);

router.post("/", requireAccess("groups:create"), createGroup);

router.put("/:id", requireAccess("groups:update"), updateGroup);

router.delete("/:id", requireAccess("groups:delete"), deleteGroup);

module.exports = router;
