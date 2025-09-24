const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller")
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/product.validate")
const upload = multer({
    storage : storageMulter()
});

router.get("/", controller.product);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiStatus)

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create",
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    validate.createPost,
    controller.editPatch
);
module.exports = router;
router.get("/detail/:id", controller.detail);
