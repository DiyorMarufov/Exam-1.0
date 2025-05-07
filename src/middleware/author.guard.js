import { errorResponse } from "../utils/index.js";

export const superAdminGuard = (req, res, next) => {
  try {
    const user = req?.user;

    if (user && user.role === "author") {
      next();
    }

    return errorResponse(res, 403, `Access denied for role ${user.role}`);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
