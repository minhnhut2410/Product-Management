const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");

// [GET] /admin/role
module.exports.index = async(req, res) => {
     let find = {
        deleted: false
    }
    const records = await Role.find(find);
        res.render("admin/pages/roles/index", {
            pageTitle: "Role",
            records: records
        }
        );
    }
module.exports.create = async(req, res) => {
   
    res.render("admin/pages/roles/create", {
        pageTitle : "Create a Role",
    });
}
module.exports.createPost = async(req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}   