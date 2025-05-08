import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const accessTokenTime = process.env.ACCESS_TOKEN_TIME;
const refreshTokenTime = process.env.REFRESH_TOKEN_TIME;

export const generateToken = {
  access: (payload) => {
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: accessTokenTime,
    });
    return accessToken;
  },

  refresh: (payload) => {
    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: refreshTokenTime,
    });
    return refreshToken;
  },
};

export const verifyToken = (token) => {
  try {
    const verifiedData = jwt.verify(token, secret);
    return {
      valid: true,
      expired: false,
      info: verifiedData,
    };
  } catch (error) {
    return {
      valid: false,
      expired: true,
      info: null,
    };
  }
};
