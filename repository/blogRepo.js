const Blogs = require("../models/blog");
const CreateError = require("../utils/ErrorClass");

exports.create = async ({ title, category, content, author }) => {
  try {
    return await Blogs.create({ title, category, content, author });
    //return blog;
  } catch (error) {
    throw error;
  }
};

exports.getAllBlogs = async (queryObj) => {
  try {
    const blogs = await Blogs.find(queryObj)
      .populate({ path: "author", select: "name" })
      .select("-__v -slug")
      .sort({ createdAt: "desc" });
    return blogs;
  } catch (error) {
    throw error;
  }
};
exports.getABlog = async (id) => {
  try {
    const blog = await Blogs.findById(id)
      .select("-__v -slug")
      .populate({ path: "author", select: "name -_id" })
      .populate({
        path: "comments",
        select: "comment createdAt",
        populate: { path: "createdBy", select: "name -_id" },
      });
    return blog;
  } catch (error) {
    throw error;
  }
};
exports.updateABlog = async (blogID, author) => {
  try {
    return await Blogs.findOneAndUpdate(
      { _id: blogID, author: author },
      update,
      {
        new: true,
        runValidators: true,
      }
    ).select("-_v");
  } catch (error) {
    throw error;
  }
};
exports.removeBlog = async (blogID, user) => {
  try {
    return await Blogs.findOneAndDelete({
      _id: blogID,
      author: user,
    });
  } catch (error) {
    throw error;
  }
};

exports.getMyBlogs = async (author) => {
  try {
    return await Blogs.find({ author })
      .select("-__v -author")
      .sort({ createdAt: "desc" })
      .cache({ key: author });
  } catch (error) {
    throw error;
  }
};

exports.addComment = async (blogID, commentID) => {
  try {
    return await Blogs.findByIdAndUpdate(
      blogID,
      { $push: { comments: commentID } },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    throw error;
  }
};
exports.removeComment = async (blogID, commentID) => {
  try {
    return await Blogs.findByIdAndUpdate(
      blogID,
      { $pull: { comments: commentID } },
      { new: true, runValidators: true }
    );
  } catch (err) {
    throw err;
  }
};
