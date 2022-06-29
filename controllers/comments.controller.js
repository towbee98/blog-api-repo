const CommentRepo = require("../repository/commentRepo");
const BlogRepo = require("../repository/BlogRepo");
const CreateError = require("../utils/ErrorClass");
const validators = require("../validators/comment");
const { clearCache } = require("../engines/cache");

exports.addComment = async (req, res, next) => {
  try {
    //console.log(req.user._id.toString());
    const createdBy = req.user._id.toString();
    const blogID = req.params.blogID;
    const { comment } = req.body;
    //Check if blog exists
    const blog = await BlogRepo.getABlog(blogID);
    //console.log(blog);
    if (!blog) return next(new CreateError(400, "Blog not found"));
    const validatedComment = await validators.validateCreateComment({
      createdBy,
      blogID,
      comment,
    });
    const newComment = await CommentRepo.CreateComment(validatedComment);
    await BlogRepo.addComment(newComment.blog, newComment._id);
    clearCache(blog.author);
    res.status(200).json({
      status: "201",
      data: newComment,
      message: "Comment created succesfully",
    });
  } catch (err) {
    //console.log(err.statusCode);
    next(new CreateError(err.statusCode, err.message));
  }
};

exports.getBlogComments = async (req, res, next) => {
  try {
    const blog = req.params.blogID;
    if (!blog) next(new CreateError(400, "Invalid blog"));
    if (!(await BlogRepo.getABlog(blog)))
      return next(new CreateError(400, "Blog not found"));
    const Comments = await CommentRepo.getAllComments(blog);
    res.status(200).json({
      status: 200,
      Comments,
      message: "All comments for this post successfully retreieved",
    });
  } catch (err) {
    next(err);
    //next(new CreateError(err.statusCode, err.message));
  }
};
exports.updateComment = async (req, res, next) => {
  try {
    const createdBy = req.user._id.toString();
    const blogID = req.params.blogID;
    const commentID = req.params.commentID;
    const { comment } = req.body;
    //console.log(comment);
    const blog = await BlogRepo.getABlog(blogID);
    if (!blog) return next(new CreateError(400, "Blog not found"));
    const validatedComment = await validators.validateUpdateComment({
      createdBy,
      blogID,
      comment,
      commentID,
      ...req.body,
    });
    //console.log(validatedComment);
    const updatedComment = await CommentRepo.updateComment(validatedComment);
    // console.log(!updatedComment);
    if (!updatedComment)
      return next(new CreateError(400, "Comment does not exist"));
    clearCache(blog.author);
    res.status(200).json({
      status: "success",
      updatedComment,
      message: "Comment updated successfully",
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    const createdBy = req.user._id.toString();
    const blogID = req.params.blogID;
    const commentID = req.params.commentID;
    const blog = await BlogRepo.getABlog(blogID);
    if (!blog) return next(new CreateError(400, "Blog not found"));
    const validatedComment = await validators.validateDeleteComment({
      createdBy,
      blogID,
      commentID,
    });
    const deletedComment = await CommentRepo.removeComment(validatedComment);
    console.log(deletedComment);
    if (!deletedComment)
      return next(new CreateError(404, "Comment not found "));
    await BlogRepo.removeComment(deletedComment.blog, deletedComment._id);

    clearCache(blog.author);
    res.status(204).json({
      status: "success",
      deletedComment,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    next(new CreateError(err.statusCode, err.message));
  }
};
