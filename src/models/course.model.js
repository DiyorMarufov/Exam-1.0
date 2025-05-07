import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: constants.category,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.user,
      required: true,
    },
  },
  { timestamps: true }
);

export const Course = model(constants.course, courseSchema);
