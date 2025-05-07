import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const enrollmentSchema = new Schema(
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
  },
  { timestamps: true }
);

export const Enrollment = model(constants.enrollment, enrollmentSchema);
