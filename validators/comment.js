const Joi = require("joi");
//Joi.objectId = require("joi-objectid")(Joi);
const CreateError = require("../utils/ErrorClass");

const CreateCommentSchema = Joi.object({
  blogID: Joi.string().required(),
  comment: Joi.string().trim().max(200).required(),
  //createdBy: Joi.objectId().required(),
  createdBy: Joi.string().hex().length(24).required(),
});

const UpdateCommentSchema = Joi.object({
  blogID: Joi.string().required(),
  comment: Joi.string().trim().max(200).required(),
  createdBy: Joi.string().hex().length(24).required(),
  commentID: Joi.string().required(),
});

const deleteCommentSchema = Joi.object({
  blogID: Joi.string().required(),
  createdBy: Joi.string().hex().length(24).required(),
  commentID: Joi.string().required(),
});
exports.validateCreateComment = async (comment) => {
  try {
    return await CreateCommentSchema.validateAsync(comment);
  } catch (error) {
    let status = error.status || 400;
    let message = error.message || "Validation Error";
    throw new CreateError(status, message);
  }
};

exports.validateUpdateComment = async (comment) => {
  try {
    return await UpdateCommentSchema.validateAsync(comment);
  } catch (error) {
    let status = error.status || 400;
    let message = error.message || "Validation Error";
    throw new CreateError(status, message);
  }
};

exports.validateDeleteComment = async (comment) => {
  try {
    return await deleteCommentSchema.validateAsync(comment);
  } catch (error) {
    let status = error.status || 400;
    let message = error.message || "Validation Error";
    throw new CreateError(status, message);
  }
};
