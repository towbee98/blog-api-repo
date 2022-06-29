const Joi = require("joi");
const CreateError = require("../utils/ErrorClass");

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required().min(7).max(12),
  passwordConfirm: Joi.ref("password"),
  passwordChangedAt: Joi.date(),
});

const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required(),
});

exports.validateCreate = async (user) => {
  try {
    return await createUserSchema.validateAsync(user);
  } catch (error) {
    let status = error.status || 500;
    let message = error.message || "Validation Error";
    throw new CreateError(status, message);
  }
};

exports.validateLogin = async (user) => {
  try {
    return await loginUserSchema.validateAsync(user);
  } catch (error) {
    let status = error.status || 500;
    let message = error.message || "Validation Error";
    return new CreateError(status, message);
  }
};
