import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

const idSchema = Joi.string().custom(isValidObjectId).required();
const nameSchema = Joi.string().min(3).max(50).trim();
const emailSchema = Joi.string().email().min(5).max(100).trim();

const createTeamMemberSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
});

const getTeamMemberSchema = Joi.object({
  id: idSchema,
});

const updateTeamMemberSchema = Joi.object({
  id: idSchema,
  name: nameSchema,
  email: emailSchema,
});

export { createTeamMemberSchema, getTeamMemberSchema, updateTeamMemberSchema };
