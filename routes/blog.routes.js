const router = require("express").Router();
const BlogController = require("../controllers/blogs.controller");
const Auth = require("../middlewares/auth");
const CommentRouter = require("./comment.routes");

router
  .route("/")
  .get(BlogController.GetAllBlogs)
  .post(Auth.protect, BlogController.CreateBlog);
router.route("/me").get(Auth.protect, BlogController.getMyBlogs);
router
  .route("/:blogID")
  .get(BlogController.GetABlog)
  .patch(Auth.protect, BlogController.UpdateBlog)
  .delete(Auth.protect, BlogController.removeBlog);

router.use("/:blogID/comments", CommentRouter);

module.exports = router;
