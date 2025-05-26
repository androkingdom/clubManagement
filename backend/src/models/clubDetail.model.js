import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const clubDetailSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      unique: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
  },
  { timestamps: true }
);

clubDetailSchema.plugin(mongooseAggregatePaginate);

export const ClubDetail = mongoose.model("ClubDetail", clubDetailSchema);
