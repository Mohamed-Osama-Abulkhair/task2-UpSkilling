process.on("uncaughtException", (err) => console.log("error in coding", err));

import { globalErrorMiddleware } from "./middleware/globalErrorMiddleware.js";
import taskRouter from "./modules/task/task.router.js";
import teamMemberRouter from "./modules/teamMember/teamMember.router.js";
import { appError } from "./utils/appError.js";

export const init = (app) => {
  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to task 2 App" });
  });
  app.use("/api/v1/members", teamMemberRouter);
  app.use("/api/v1/tasks", taskRouter);

  app.all("*", (req, res, next) => {
    next(new appError("invalid url" + req.originalUrl, 404));
  });

  // global error handling middleware
  app.use(globalErrorMiddleware);
};

process.on("unhandledRejection", (err) =>
  console.log("error outside express", err)
);
