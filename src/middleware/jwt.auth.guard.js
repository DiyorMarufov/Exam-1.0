import { errorResponse, verifyToken } from "../utils/index.js";

export const jwtAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, 400, `Authorization header required`);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return errorResponse(res, 400, `Invalid type or token not found`);
    }

    const { valid, expired, info } = verifyToken(token);

    if (!valid) {
      return errorResponse(
        res,
        401,
        expired ? `Token expired` : `Invalid token`
      );
    }

    req.user = {
      sub: info.sub,
      role: info.role,
    };

    return next();
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
