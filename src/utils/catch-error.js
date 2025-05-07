export const errorResponse = (res, statusCode, message, error = {}) => {
  return res.status(statusCode).json({ statusCode, message, error });
};
