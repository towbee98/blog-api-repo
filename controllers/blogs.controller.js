// const Blogs = require("./../models/blog");
const { promisify } = require("util");
const redis = require("redis");
const { REDIS_URI_LOCAL } = require("../config/env");
const BlogRepo = require("../repository/blogRepo");
const CreateError = require("./../utils/ErrorClass");
const { clearCache } = require("../engines/cache");
const { getRedisData, setRedisData } = require("../utils/redis");

exports.GetAllBlogs = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    //Filter out the query parameters
    const allowedFields = ["category", "title"];
    Object.keys(queryObj).forEach((el) => {
      queryObj[el] = queryObj[el].trim().toLowerCase();
      if (!allowedFields.includes(el) || !queryObj[el]) delete queryObj[el];
    });
    //Find and sort the data being queried
    // console.log(queryObj);
    const stories = await BlogRepo.getAllBlogs(queryObj);
    res.status(200).json({
      status: "success",
      length: stories.length,
      data: stories,
      message: "Blog stories successfully retrieved",
    });
  } catch (error) {
    next(error);
  }
};

exports.GetABlog = async (req, res, next) => {
  try {
    const blogID = req.params.blogID.trim();
    if (!blogID) return next(new CreateError(400, "Specify a valid blog id"));
    const story = await BlogRepo.getABlog(blogID);
    if (!story) return next(new CreateError(400, "Blog not found "));
    res.status(200).json({
      status: "success",
      data: story,
      message: "Blog successfully fetched",
    });
  } catch (error) {
    // console.log(error.kind);
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};

exports.CreateBlog = async (req, res, next) => {
  try {
    const author = req.user._id;
    const data = req.body;
    Object.keys(data).forEach((el) => (data[el] = data[el].trim()));
    const { title, category, content } = data;
    // console.log(title, category, content);
    const blog = await BlogRepo.create({ title, category, content, author });
    //console.log(blog);
    if (!blog)
      return next(new CreateError(400, "An error occured, Please try again"));
    clearCache(author);
    res.status(201).json({
      status: "success",
      data: blog,
      message: "Blog uploaded succssfully",
    });
  } catch (error) {
    //console.log(error);
    next(error);
  }
};

exports.UpdateBlog = async (req, res, next) => {
  try {
    const blogID = req.params.blogID;
    if (!blogID) return next(new CreateError(400, "Specify a valid blog id"));
    const author = req.user._id;
    if (!author) return next(new CreateError(400, "Sorry,Please login again"));
    const update = { ...req.body };
    Object.keys(update).forEach((el) => (update[el] = update[el].trim()));
    const updatedStory = await BlogRepo.updateABlog(blogID, author);
    if (!updatedStory) return next(new CreateError(400, "Blog not found"));
    clearCache(author);
    res.status(200).json({
      status: "success",
      data: updatedStory,
      message: "Story updated successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    next(new CreateError(400, error.message));
  }
};

exports.getMyBlogs = async (req, res, next) => {
  try {
    const author = req.user._id;
    // const cachedBlogs = await getRedisData(`${author}`);
    // if (cachedBlogs) {
    //   return res.status(200).json({
    //     status: "success",
    //     size: cachedBlogs.length,
    //     data: cachedBlogs,
    //   });
    // }
    const blogs = await BlogRepo.getMyBlogs(author);
    // setRedisData(`${author}`, blogs);
    // if (!blogs) next(new CreateError(404, "Blogs not found "));
    res.status(200).json({
      status: "success",
      size: blogs.length,
      data: blogs,
    });

    // await promisify(client.SET)(author, JSON.stringify(blogs));
  } catch (error) {
    console.log("error from the cache");
    console.log(error);
    next(error);
  }
};

exports.removeBlog = async (req, res, next) => {
  try {
    const blogID = req.params.blogID;
    const user = req.user._id;
    // console.log(user, blogID);
    // const r emovedBlog = await Blogs.findByIdAndDelete(blogID);
    const removedBlog = await BlogRepo.removeBlog(blogID, user);
    if (!removedBlog)
      return next(new CreateError(403, "Blog not found or already deleted"));
    clearCache(user);
    res.status(204).json({
      status: "success",
      data: removedBlog,
      message: "Story deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "Blog not found"));
    return next(new CreateError(400, error.message));
  }
};
