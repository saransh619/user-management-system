import Joi from "joi";

const CreateUser = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
  role: Joi.string().valid("user", "admin", "editor").default("user"),
});

const UpdateUser = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  address: Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }),
  role: Joi.string().valid("user", "admin", "editor").optional(),
});

const LoginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { CreateUser, UpdateUser, LoginUser };
