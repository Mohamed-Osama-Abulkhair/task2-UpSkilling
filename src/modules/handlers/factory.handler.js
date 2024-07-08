import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { appError } from "../../utils/appError.js";

const deleteOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const result = await model.findByIdAndDelete(id);

    !result && next(new appError("document not found", 404));
    result && res.status(200).json({ message: "success", result });
  });
};

const getOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const result = await model.findById(id);

    !result && next(new appError("document not found", 404));
    result && res.status(200).json({ message: "success", result });
  });
};

export { deleteOne,getOne };
