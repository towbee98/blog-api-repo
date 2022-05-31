const router = require("express").Router();
const BlogController = require("../services/blogs.controller");

router
  .route("/")
  .get(BlogController.GetAllBlogs)
  .post(BlogController.CreateBlog);
router
  .route("/:id")
  .get(BlogController.GetABlog)
  .patch(BlogController.UpdateBlog)
  .delete(BlogController.removeBlog);

module.exports = router;
