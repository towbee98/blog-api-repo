const router = require("express").Router();
const CreateError = require("../utils/ErrorClass");
const BlogRouter = require("./blog.routes");
// router.use("/", (req, res, next) => {
//   res.status(200).json({
//     status: "success",
//     message: "Welcome to the africoders blog API",
//   });
// });
router.use("/blogs", BlogRouter);

router.use("/*", (req, res, next) => {
  next(new CreateError(404, "Route not found"));
});

module.exports = router;
