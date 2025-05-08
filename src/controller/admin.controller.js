import { User } from "../models/index.js";
import {
  errorResponse,
  successResponse,
  hashPass,
  comparePass,
  generateToken,
  refTokenWriteCookie,
  verifyToken,
} from "../utils/index.js";
import { userUpdateValidation, userValidation } from "../validation/index.js";

export class AdminController {
  async createSuperAdmin(req, res) {
    try {
      const { success, errors, data } = userValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }
      const { fullName, email, password } = data;

      const superAdmin = await User.findOne({ role: "superadmin" });

      if (superAdmin) {
        return errorResponse(res, 409, `Super admin already exists`);
      }

      const hashedPassword = await hashPass(password);
      const newSuperAdmin = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "superadmin",
        otpEnabled: null,
        otpSecret: null,
      });

      return successResponse(res, 201, `success`, newSuperAdmin);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signinSuperAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const superadmin = await User.findOne({ email });

      if (!superadmin) {
        return errorResponse(res, 404, `Super admin not found`);
      }

      const isMatch = await comparePass(password, superadmin.password);

      if (!isMatch) {
        return errorResponse(res, 401, `invalid password`);
      }

      const payload = {
        sub: superadmin._id,
        role: superadmin.role,
      };

      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, "refreshTokenSuperAdmin", refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async createAdmin(req, res) {
    try {
      const { success, errors, data } = userValidation(req.body);

      if (!success) {
        return errorResponse(res, 400, `Validation error`, errors);
      }

      const { fullName, email, password } = data;

      const admin = await User.findOne({ email });

      if (admin) {
        return errorResponse(res, 409, `Admin already exists`);
      }

      const hashedPassword = await hashPass(password);

      const newAdmin = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "admin",
        otpEnabled: null,
        otpSecret: null,
      });

      return successResponse(res, 201, `success`, newAdmin);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signInAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await User.findOne({ email });

      if (!admin) {
        return errorResponse(res, 404, `Admin not found`);
      }

      const isMatch = await comparePass(password, admin.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: admin._id,
        role: admin.role,
      };

      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, "refreshTokenAdmin", refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async accessTokenAdmin(req, res) {
    try {
      const refreshTokenCookie = req.cookies.refreshTokenAdmin;

      if (!refreshTokenCookie) {
        return errorResponse(res, 401, `Refresh token admin not found`);
      }

      const { info } = verifyToken(refreshTokenCookie);

      if (!info) {
        return errorResponse(res, 401, `Invalid data`);
      }

      const payload = {
        sub: info._id,
        role: info.role,
      };
      const accessToken = generateToken.access(payload);
      const refreshToken = generateToken.refresh(payload);
      refTokenWriteCookie(res, `refreshTokenAdmin`, refreshToken);

      return successResponse(res, 200, `success`, accessToken);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async signoutAdmin(req, res) {
    try {
      const refreshTokenCookie = req.cookies.refreshTokenAdmin;

      if (!refreshTokenCookie) {
        return errorResponse(res, 401, `Refresh token admin not found`);
      }

      const { info } = verifyToken(refreshTokenCookie);

      if (!info) {
        return errorResponse(res, 401, `Invalid data`);
      }

      res.clearCookie("refreshTokenAdmin");

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllAdmins(__, res) {
    try {
      const admins = await User.find({ role: "admin" });

      return successResponse(res, 200, `success`, admins);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllTeachers(__, res) {
    try {
      const authors = await User.find({ role: "author" });

      return successResponse(res, 200, `success`, authors);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getAllUsers(__, res) {
    try {
      const users = await User.find({ role: "user" });

      return successResponse(res, 200, `success`, users);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
  
  async updateAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminController.findAdminById(res, id);

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

      const updatedAdmin = await User.findByIdAndUpdate(
        admin._id,
        { $set: data },
        {
          new: true,
        }
      );

      return successResponse(res, 200, `success`, updatedAdmin);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async deleteAdminById(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminController.findAdminById(res, id);
      await User.findByIdAndDelete(admin._id);

      return successResponse(res, 200, `success`);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async findAdminById(res, id) {
    try {
      if (!id) {
        return errorResponse(res, 400, `ID is required`);
      }

      const admin = await User.findById(id);

      if (!admin) {
        return errorResponse(res, 404, `Admin not found`);
      }
      return admin;
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}
