import mongoose from "mongoose";

const teamMemberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "team member name is required"],
      minLength: [3, "too short team member name"],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "email required"],
      minLength: [5, "too short email"],
      maxLength: [100, "too long email"],
      unique: [true, "email must be unique"],
      lowercase: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invalid email format.",
      },
    },
  },

  { timestamps: true }
);

export const teamMemberModel = mongoose.model("teamMember", teamMemberSchema);
