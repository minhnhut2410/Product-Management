// [GET] /admin/product
const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/searchHelper");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination");
module.exports.product = async (req, res) => {
    //Filter
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    //Find
    const countProducts = await Product.countDocuments(find);
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //Pagination

    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        }, req.query,
        countProducts
    );
    const products = await Product.find(find).sort({
        position: "desc"
    }).limit(objectPagination.limitItems).skip(objectPagination.skip);

    //End Pagination 

    res.render("admin/pages/product/index", {
        pageTitle: "Product Page",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        objectPagination
    });

}

//[PATCH] /admin/products/chane-status

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    req.flash("success", "The status has been updated succesfully");
    await Product.updateOne({
        _id: id
    }, {
        status: status
    });
    const returnUrl = req.get('Referer') || '/admin/products';
    res.redirect(returnUrl);
}

//[PATCH] /admin/products/change-multi
module.exports.changeMultiStatus = async (req, res) => {
    const idString = req.body.ids;
    const ids = idString.split(",");
    const type = req.body.type
    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $set: {
                    status: "active"
                }
            });
            req.flash("success", `The status of ${ids.length} products has been updated succesfully`);

            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $set: {
                    status: "inactive"
                }
            });
            req.flash("success", `The status of ${ids.length} products has been updated succesfully`);

            break;
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $set: {
                    deleted: "true",
                    deletedAt: new Date()
                }
            });
            req.flash("success", `${id.length} have been deleted`);

            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            default:
                break;
    }
    const returnUrl = req.get('Referer') || '/admin/products';
    res.redirect(returnUrl);
};

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    });
    const returnUrl = req.get('Referer') || '/admin/products';
    res.redirect(returnUrl);
}

//[GET] /admin/products/create

module.exports.create = async(req, res) => {
    res.render("admin/pages/product/create", {
        pageTitle : "Create a new product"
    });
}
module.exports.createPost = async(req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);

    req.body.stock = parseInt(req.body.stock);
    if(req.body.position == ""){
        const total = await Product.countDocuments();
        req.body.position = total +1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }
    if(req.file)
    {
        req.body.thumbnail = `/upload/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}   

//[GET] /admin/products/edit
module.exports.edit = async(req, res) => {
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/product/edit", {
        pageTitle : "Edit the product",
        product: product
    });
    }
    catch(error){
        req.flash("error", "Can not update the product. Please try again");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

//[PATCH] /admin/products/editPatch
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.position = parseInt(req.body.position);
    req.body.stock = parseInt(req.body.stock);
    if(req.file)
    {
        req.body.thumbnail = `/upload/${req.file.filename}`;
    }
    await Product.updateOne({ _id: req.params.id }, req.body)
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}
module.exports.detail = async(req, res) => {
    try {
        const find = {
        deleted: false,
        _id: req.params.id
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/product/detail", {
        pageTitle : product.title,
        product: product
    });
    }
    catch(error){
        req.flash("error", "Can not update the product. Please try again");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}