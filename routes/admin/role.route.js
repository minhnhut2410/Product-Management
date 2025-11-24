const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller")

router.get("/", controller.index);
module.exports = router;
router.get("/create", controller.create);
router.post("/create",
    controller.createPost
);