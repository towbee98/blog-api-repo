const router= require("express").Router();
// const passport= require("passport");
// const passportConfig= require("../utils/passport")
const viewController= require("../controllers/view.controller")
// const Oauth= require("../utils/oauth")
const userController=require("../controllers/user.controller")

router.route("/").get(viewController.home)

router.route("/auth/login").get(viewController.login)
router.route("/auth/logout").get(viewController.logout);

//Auth with google to handle google redirect
router.route("/auth/google/callback").get(userController.handleRedirect)

router.route("/blogs/create").get(viewController.authCheck,viewController.create)

module.exports=router;