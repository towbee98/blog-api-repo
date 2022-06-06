const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.route("/login").post(userController.login);

router.route("/Signup").post(userController.SignUp);

router.route("/forgetpassword").post(userController.forgetPassword);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
