import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayImage: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    memberRole: {
      type: String,
      enum: ["member", "mentor"],
      default: "member",
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const Member = mongoose.model("Member", memberSchema);
