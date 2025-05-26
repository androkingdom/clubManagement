import mongoose, { Schema } from "mongoose";

const announcementSchema = new Schema(
  {
    resource: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
