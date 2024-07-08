import { teamMemberModel } from "../../../databases/models/teamMember.model.js";
import { appError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import * as factory from "../handlers/factory.handler.js";

// 1- get all members
const getAllMembers = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(teamMemberModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();

  const result = await apiFeatures.mongooseQuery.exec();

  const totalMembers = await teamMemberModel.countDocuments(
    apiFeatures.mongooseQuery._conditions
  );

  !result.length && next(new appError("Not members added yet", 404));

  apiFeatures.calculateTotalAndPages(totalMembers);
  result.length &&
    res.status(200).json({
      message: "success",
      totalMembers,
      metadata: apiFeatures.metadata,
      result,
    });
});

// 2- get member
const getMember = factory.getOne(teamMemberModel);

// 3- create new member
const createNewMember = catchAsyncError(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const member = await teamMemberModel.findOne({ email });
  if (member) return next(new appError("Email already exists", 409));

  const result = new teamMemberModel({
    name: req.body.name,
    email,
  });
  await result.save();

  res.status(201).json({ message: "success", result });
});

// 4- update member
const updateMember = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const member = await teamMemberModel.findById(id);
  if (!member) return next(new appError("member not found", 404));

  if (req.body.email) {
    const existsData = await teamMemberModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existsData)
      return next(new appError("Email already belongs to another member", 409));
    member.email = req.body.email.toLowerCase();
  }

  req.body?.name ? (member.name = req.body.name) : "";

  await member.save();
  res.status(200).json({ message: "success", member });
});

// 5- Delete member
const deleteMember = factory.deleteOne(teamMemberModel);

export {
  getAllMembers,
  getMember,
  createNewMember,
  updateMember,
  deleteMember,
};
