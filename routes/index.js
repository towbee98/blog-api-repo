const router = require("express").Router();
const BlogRouter = require("./blog.routes");
router.use("/blogs", BlogRouter);

module.exports = router;
