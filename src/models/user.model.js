import { Schema, model } from "mongoose";
import { constants } from "../common/constants/index.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin", "author"],
      required: false,
    },
    otpSecret: {
      type: String,
      required: false,
    },
    otpEnabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

export const User = model(constants.user, userSchema);
