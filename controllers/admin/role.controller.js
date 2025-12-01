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
//[GET] /admin/roles/edit
module.exports.edit = async(req, res) => {
    try {
        const data = {
        deleted: false,
        _id: req.params.id
    };
    let find = {
        deleted: false
    }
    const role = await Role.findOne(data);
    res.render("admin/pages/roles/edit", {
        pageTitle : "Edit the Role",
        role: role,
    });
    }
    catch(error){
        req.flash("error", "Can not update the Role. Please try again");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[PATCH] /admin/roles/editPatch
module.exports.editPatch = async (req, res) => {
    try {
        // Update the role
        await Role.updateOne(
            { _id: req.params.id },
            req.body
        );

        req.flash("success", "Role updated successfully");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Cannot update Role. Please try again.");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    });
    const returnUrl = req.get('Referer') || '/admin/roles';
    res.redirect(returnUrl);
}
module.exports.detail = async(req, res) => {
    const id = req.params.id;
    let find = {
        deleted: false,
        _id: id
    }
    const role = await Role.findOne(find);
    res.render("admin/pages/roles/detail", {
        pageTitle: "Detail Role",
        role: role
    })
}
module.exports.permission = async(req, res) => {
    let find = {
        deleted: false,
    }
        const records = await Role.find(find);

    res.render("admin/pages/roles/permissions",{
        pageTitle: "Authorization",
        records: records
    })

}
module.exports.permissionsPatch = async (req, res) => {
     try {
       const permissions = JSON.parse(req.body.permissions)
        for(const item of permissions){
            await Role.updateOne({_id: item.id}, {permissions: item.permissions});
        }
     req.flash("success", "Permissions updated successfully");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);

    } catch (error) {
        console.error(error);
        req.flash("error", "Cannot update permissions. Please try again.");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    }
    
}