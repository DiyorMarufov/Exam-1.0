import { User } from "../models/index.js";
import { errorResponse, successResponse, hashPass } from "../utils/index.js";
import { userValidation } from "../validation/index.js";

export class UserController {
  async createSuperAdmin(req, res) {
    try {
      const { data } = userValidation(req.body);

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
  
}
