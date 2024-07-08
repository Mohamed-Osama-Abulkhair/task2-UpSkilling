import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "task name is required"],
      minLength: [3, "too short task name"],
      unique: [true, "task name must be unique"],
    },

    description: {
      type: String,
      minLength: [10, "too short task description"],
      maxLength: [5000, "too more task description"],
      required: [true, "task description is required"],
    },

    status: {
      type: String,
      enum: ["completed", "notComplete", "inReview"],
      required: [true, "task status is required"],
    },

    startDate: {
      type: Date,
      required: [true, "task start Date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "task end Date is required"],
    },

    taskFor: {
      type: mongoose.Types.ObjectId,
      ref: "teamMember",
      required: [true, "member is required"],
    },
  },
  { timestamps: true }
);

taskSchema.pre(/^find/, function () {
  this.populate("taskFor");
});

export const taskModel = mongoose.model("task", taskSchema);
