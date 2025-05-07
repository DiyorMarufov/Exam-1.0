export const refTokenWriteCookie = (res, message, refreshToken) => {
  return res.cookie(message, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
