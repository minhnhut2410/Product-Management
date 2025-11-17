const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/product-category.validate");
const controller = require("../../controllers/admin/product-category.controller");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


// CRUD Routes
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.get("/create", controller.create);
router.post("/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);
router.patch("/editPatch/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.editPatch
);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
