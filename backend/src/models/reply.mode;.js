import mongoose, { mongo, Schema } from "mongoose";

const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  { timestamps: true }
);

export const Reply = mongoose.model("Reply", replySchema);
