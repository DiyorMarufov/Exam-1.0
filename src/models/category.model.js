import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Category = model(constants.category, categorySchema);
