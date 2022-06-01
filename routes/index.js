const router = require("express").Router();
const BlogRouter = require("./blog.routes");
router.use("/blogs", BlogRouter);
router.use("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the africoders blog API",
  });
});

module.exports = router;
