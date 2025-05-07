import speakeasy from "speakeasy";

import { User } from "../models/index.js";

export const otp = {
  generateOtp: async (userId) => {
    const secret = speakeasy.generateSecret({ length: 20 });

    await User.findByIdAndUpdate(userId, {
      otpSecret: secret.base32,
      otpEnabled: true,
    });

    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    return token;
  },
  verifyOtp: async (userId, otp) => {
    const user = await User.findById(userId);
    if (!user || !user.otpSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });
  },
};
