import { appError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import * as factory from "../handlers/factory.handler.js";
import { taskModel } from "../../../databases/models/task.model.js";
import { teamMemberModel } from "../../../databases/models/teamMember.model.js";

// 1- get all tasks
const getAllTasks = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(taskModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();

  const result = await apiFeatures.mongooseQuery.exec();

  const totalTasks = await taskModel.countDocuments(
    apiFeatures.mongooseQuery._conditions
  );

  !result.length && next(new appError("Not tasks added yet", 404));

  apiFeatures.calculateTotalAndPages(totalTasks);
  result.length &&
    res.status(200).json({
      message: "success",
      totalTasks,
      metadata: apiFeatures.metadata,
      result,
    });
});

// 2- get task
const getTask = factory.getOne(taskModel);

// 3- create new task
const createNewTask = catchAsyncError(async (req, res, next) => {
  const task = await taskModel.findOne({ name: req.body.name });
  if (task) return next(new appError("task name is exists", 409));
  const member = await teamMemberModel.findById(req.body.taskFor);
  if (!member) return next(new appError("member(taskFor) not found", 404));

  const result = new taskModel(req.body);
  await result.save();

  res.status(201).json({ message: "success", result });
});

// 4- update task
const updateTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await taskModel.findById(id);
  if (!task) return next(new appError("task not found", 404));

  if (req.body.taskFor) {
    const member = await teamMemberModel.findById(req.body.taskFor);
    if (!member) return next(new appError("member(taskFor) not found", 404));
    task.taskFor = req.body.taskFor;
  }
  if (req.body.name) {
    const exist = await taskModel.findOne({ name: req.body.name });
    if (exist) return next(new appError("task name is exists", 409));
    task.name = req.body.name;
  }
  req.body?.description ? (task.description = req.body.description) : "";
  req.body?.status ? (task.status = req.body.status) : "";
  req.body?.startDate ? (task.startDate = req.body.startDate) : "";
  req.body?.endDate ? (task.endDate = req.body.endDate) : "";

  await task.save();
  res.status(200).json({ message: "success", task });
});

// 5- Delete task
const deleteTask = factory.deleteOne(taskModel);

export { getAllTasks, getTask, createNewTask, updateTask, deleteTask };
