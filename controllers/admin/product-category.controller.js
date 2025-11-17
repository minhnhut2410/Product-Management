const systemConfig = require("../../config/system");
const productCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/searchHelper");
const createTreeHelper = require("../../helpers/createTree");
const Product = require("../../models/product.model");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    //Filter
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    // End filter

    //Find
    const countProducts = await productCategory.countDocuments(find);
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //End Find
    //Sort
    // let sort = {};
    // if(req.query.sortKey && req.query.sortValue){
    //     sort[req.query.sortKey] = req.query.sortValue;
    // }
    // else {
    // sort.position = "desc";
    // }

    //End Sort
    const records = await productCategory.find(find);
        if (objectSearch.keyword) {
        // Searching → don't use tree
        newRecords = records;
    } else {
        // Normal page → make tree
        newRecords = createTreeHelper(records);
    }

    res.render("admin/pages/products-category/index", {
        pageTitle: "Product Category",
        records : newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,

    });
    
}

// [GET] /admin/product-category/create

module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await productCategory.find(find);
    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Create A Product Category",
        records: newRecords
    });
}

// [POST] /admin/product-category/create

module.exports.createPost = async(req, res) => {
    if(req.body.position == ""){
            const count = await productCategory.countDocuments();
            req.body.position = count +1;
        }
    else{ 
        req.body.position = parseInt(req.body.position);
    }
    const recond = new productCategory(req.body);
    await recond.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    
}   

//[PATCH]  /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    req.flash("success", "The status has been updated succesfully");
    await productCategory.updateOne({
        _id: id
    }, {
        status: status
    });
    const returnUrl = req.get('Referer') || '/admin/products-category';
    res.redirect(returnUrl);
}
module.exports.detail = async(req, res) => {
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    };
    const category = await productCategory.findOne(find);
    res.render("admin/pages/products-category/detail", {
        pageTitle : category.title,
        category: category
    });
    }
    catch(error){
        req.flash("error", "Can not update the product. Please try again");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
} 
//[GET] /admin/products-category/edit
module.exports.edit = async(req, res) => {
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    };
    const category = await productCategory.findOne(find);
    const categories = await productCategory.find(find);
    const newRecords = createTreeHelper(categories);

    res.render("admin/pages/products-category/edit", {
        pageTitle : "Edit the product",
        category: category,
        newRecords : newRecords
    });
    }
    catch(error){
        req.flash("error", "Can not update the product. Please try again");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

//[PATCH] /admin/products-category/editPatch
module.exports.editPatch = async (req, res) => {
    try {
        // Convert numeric fields
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }

        // Handle thumbnail if uploaded
        if (req.file) {
            req.body.thumbnail = `/upload/${req.file.filename}`;
        }

        // Update the category
        await productCategory.updateOne(
            { _id: req.params.id },
            req.body
        );

        req.flash("success", "Category updated successfully");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Cannot update category. Please try again.");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await productCategory.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    });
    const returnUrl = req.get('Referer') || '/admin/products-category';
    res.redirect(returnUrl);
}