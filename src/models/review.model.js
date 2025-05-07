import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.user,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: constants.course,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = model(constants.review, reviewSchema);
