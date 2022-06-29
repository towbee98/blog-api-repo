const Comment = require("../models/comments");

exports.CreateComment = async (data) => {
  try {
    const { createdBy, comment, blogID } = data;
    return await Comment.create({ createdBy, comment, blog: blogID });
  } catch (error) {
    throw error;
  }
};

exports.getAllComments = async (blogID) => {
  try {
    return await Comment.find({ blogID }).select("-__v");
  } catch (error) {
    throw error;
  }
};

exports.updateComment = async (commentUpdate) => {
  try {
    const update = await Comment.findOneAndUpdate(
      {
        _id: commentUpdate.commentID,
        createdBy: commentUpdate.createdBy,
        blog: commentUpdate.blogID,
      },
      { comment: commentUpdate.comment },
      { runValidators: true, new: true }
    );
    return update;
  } catch (error) {
    throw error;
  }
};

exports.removeComment = async (comment) => {
  try {
    return await Comment.findOneAndDelete({
      _id: comment.commentID,
      createdBy: comment.createdBy,
      blog: comment.blogID,
    });
  } catch (error) {
    throw error;
  }
};
