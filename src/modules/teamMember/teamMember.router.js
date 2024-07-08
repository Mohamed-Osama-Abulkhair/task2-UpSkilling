import express from "express";
import * as userController from "./teamMember.controller.js";
import {
  createTeamMemberSchema,
  getTeamMemberSchema,
  updateTeamMemberSchema,
} from "./teamMember.validation.js";
import { validation } from "../../middleware/validation.js";

const teamMemberRouter = express.Router();

teamMemberRouter
  .route("/")
  .post(validation(createTeamMemberSchema), userController.createNewMember)
  .get(userController.getAllMembers);

teamMemberRouter
  .route("/:id")
  .put(validation(updateTeamMemberSchema), userController.updateMember)
  .delete(validation(getTeamMemberSchema), userController.deleteMember)
  .get(validation(getTeamMemberSchema), userController.getMember);

export default teamMemberRouter;
