const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    comment: String,
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogs",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
