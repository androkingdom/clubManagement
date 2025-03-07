import mongoose, { Schema } from "mongoose";

const clubSchema = new Schema(
  {
    logo: {
      type: String,
      required: true
    },
    clubName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Club = mongoose.model("Club", clubSchema);
