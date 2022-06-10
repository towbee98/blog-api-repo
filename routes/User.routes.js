const router = require("express").Router();
const userController = require("../controllers/user.controller");
const Auth = require("../middlewares/auth");

router.route("/login").post(userController.login);

router.route("/Signup").post(userController.SignUp);

router.route("/forgetpassword").post(userController.forgetPassword);

router.use(Auth.protect);
router
  .route("/me")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/").get( userController.getAllUsers);

module.exports = router;
