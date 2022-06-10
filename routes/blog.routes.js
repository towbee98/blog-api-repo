const router = require("express").Router();
const BlogController = require("../controllers/blogs.controller");
const Auth = require("../middlewares/auth");

router
  .route("/")
  .get(BlogController.GetAllBlogs)
  .post(Auth.protect, BlogController.CreateBlog);
router.route("/me").get(Auth.protect,BlogController.getMyBlogs)
router
  .route("/:id")
  .get(BlogController.GetABlog)
  .patch(Auth.protect, BlogController.UpdateBlog)
  .delete(Auth.protect, BlogController.removeBlog);

module.exports = router;
