import { errorResponse } from "../utils/index.js";

export const adminAndAuthorGuard = (req, res, next) => {
  try {
    const user = req?.user;

    if (
      user &&
      (user.role === "admin" ||
        user.role === "superadmin" ||
        (user.role === "author" && req.params.id === user.sub))
    ) {
      return next();
    }

    return errorResponse(res, 403, `Access denied for role ${user.role}`);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
