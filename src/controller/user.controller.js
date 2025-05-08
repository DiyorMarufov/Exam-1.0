import { User } from "../models/index.js";
import {
  errorResponse,
  successResponse,
  hashPass,
  comparePass,
  generateToken,
  refTokenWriteCookie,
  verifyToken,
  otp_generator,
  sendEmail,
} from "../utils/index.js";
import { userValidation, userUpdateValidation } from "../validation/index.js";

export class UserController {
  async signupUser(req, res) {
    try {
      const { success, errors, data } = userValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { fullName, email, password } = data;

      const user = await User.findOne({ email });

      if (user) {
        return errorResponse(res, 409, `User already exists`);
      }

      const hashedPass = await hashPass(password);

      const newUser = await User.create({
        fullName,
        email,
        password: hashedPass,
        role: "user",
        otpEnabled: false,
        otpSecret: null,
      });
      const otp = await otp_generator.generateOtp(newUser._id);
      await sendEmail(email, `OTP`, `Your otp code is ${otp}`);

      return successResponse(
        res,
        201,
        `User registered successfully, OTP sent to ${email}`,
        {
          fullName,
          email,
        }
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await otp_generator.verifyOtp(user._id, otp);

      if (!isMatch) {
        return errorResponse(res, 400, `Invalid otp or otp expired`);
      }

      return successResponse(res, 200, `User verified successfully`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signinUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await comparePass(password, user.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: user._id,
        role: user.role,
      };

      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, "refreshTokenUser", refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async profileUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await comparePass(password, user.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      return successResponse(res, 200, `success`, user);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signupAuthor(req, res) {
    try {
      const { success, errors, data } = userValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { fullName, email, password } = data;

      const user = await User.findOne({ email });

      if (user) {
        return errorResponse(res, 409, `Author already exists`);
      }

      const hashedPass = await hashPass(password);

      await User.create({
        fullName,
        email,
        password: hashedPass,
        role: "author",
        otpEnabled: false,
        otpSecret: null,
      });

      return successResponse(res, 201, `Author registered successfully`, {
        fullName,
        email,
      });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signinAuthor(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, 404, `Author not found`);
      }

      const isMatch = await comparePass(password, user.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: user._id,
        role: user.role,
      };

      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, "refreshTokenAuthor", refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async accessToken(req, res) {
    try {
      const refreshTokenUser = req.cookies.refreshTokenUser;

      if (!refreshTokenUser) {
        return errorResponse(res, 401, `Refresh token user not found`);
      }

      const { info } = verifyToken(refreshTokenUser);

      if (!info) {
        return errorResponse(res, 401, `Invalid data`);
      }

      const payload = {
        sub: info._id,
        role: info.role,
      };

      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, "refreshTokenUser", refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async updateUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserController.findUserById(res, id);

      const { success, errors, data } = userUpdateValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      if (data.email) {
        const existsEmail = await User.findOne({ email: data.email });

        if (existsEmail && id !== existsEmail._id.toString()) {
          return errorResponse(res, 400, `Email already exists`);
        }
      }

      if (data.password) {
        data.password = await hashPass(data.password);
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: data },
        {
          new: true,
        }
      );

      return successResponse(res, 200, `success`, updatedUser);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserController.findUserById(res, id);
      await User.findByIdAndDelete(user._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signoutUser(req, res) {
    try {
      const refreshTokenUser = req.cookies.refreshTokenUser;

      if (!refreshTokenUser) {
        return errorResponse(res, 401, `Refresh token user not found`);
      }

      const { info } = verifyToken(refreshTokenUser);

      if (!info) {
        return errorResponse(res, 401, `Invalid data`);
      }

      res.clearCookie("refreshTokenUser");

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findUserById(res, id) {
    try {
      if (!id) {
        return errorResponse(res, 400, `ID is required`);
      }

      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 404, `User not found`);
      }
      return user;
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}
