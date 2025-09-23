module.exports.createPost = async (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Please enter the title`);
        const returnUrl = req.get('Referer') || '/admin/products';
        res.redirect(returnUrl);
        return;
    }
    next();

}