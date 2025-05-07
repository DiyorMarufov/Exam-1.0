import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: constants.payment,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: constants.course,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = model(constants.payment, paymentSchema);
