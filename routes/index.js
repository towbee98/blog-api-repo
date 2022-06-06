const router = require("express").Router();
const CreateError = require("../utils/ErrorClass");
const BlogRouter = require("./blog.routes");
const UserRouter = require("./User.routes");

// router.use("/", (req, res, next) => {
//   res.status(200).json({
//     status: "success",
//     message: "Welcome to the africoders blog API",
//   });
// });

router.use("/blogs", BlogRouter);
router.use("/users", UserRouter);

router.use("/*", (req, res, next) => {
  next(new CreateError(404, "Route not found"));
});

module.exports = router;
