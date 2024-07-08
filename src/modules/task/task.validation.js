import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

const idSchema = Joi.string().custom(isValidObjectId).required();
const nameSchema = Joi.string().min(3).max(50).trim();
const descriptionSchema = Joi.string().min(10).max(5000).trim();
const statusTypes = ["completed", "notComplete", "inReview"];
const statusSchema = (validRoles) =>
  Joi.string()
    .required()
    .valid(...validRoles);
const dateSchema = Joi.date();
const taskForSchema = Joi.string().custom(isValidObjectId);

const createTaskSchema = Joi.object({
  name: nameSchema.required(),
  description: descriptionSchema.required(),
  status: statusSchema(statusTypes),
  startDate: dateSchema.required(),
  endDate: dateSchema.required(),
  taskFor: taskForSchema.required(),
}).custom((value, helpers) => {
  if (value.startDate >= value.endDate) {
    return helpers.message("Start date must be before end date");
  }
  return value;
});

const getTaskSchema = Joi.object({
  id: idSchema,
});

const updateTaskSchema = Joi.object({
  id: idSchema,
  name: nameSchema,
  description: descriptionSchema,
  status: statusSchema(statusTypes),
  startDate: dateSchema,
  endDate: dateSchema,
  taskFor: taskForSchema,
}).custom((value, helpers) => {
  if (value?.startDate >= value?.endDate) {
    return helpers.message("Start date must be before end date");
  }
  return value;
});

export { createTaskSchema, getTaskSchema, updateTaskSchema };
