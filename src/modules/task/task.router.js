import express from "express";
import * as taskController from "./task.controller.js";
import {
  createTaskSchema,
  getTaskSchema,
  updateTaskSchema,
} from "./task.validation.js";
import { validation } from "../../middleware/validation.js";

const taskRouter = express.Router();

taskRouter
  .route("/")
  .post(validation(createTaskSchema), taskController.createNewTask)
  .get(taskController.getAllTasks);

taskRouter
  .route("/:id")
  .put(validation(updateTaskSchema), taskController.updateTask)
  .delete(validation(getTaskSchema), taskController.deleteTask)
  .get(validation(getTaskSchema), taskController.getTask);

export default taskRouter;
