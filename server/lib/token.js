import jwt from "jsonwebtoken";

// create access token
export const createAccessToken = (
  userId,
  name,
  tokenVersion,
) => {
  const payload = { sub: userId, name, tokenVersion };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

// verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
};

// create refresh token
export const createRefreshToken = (userId, tokenVersion) => {
  const payload = { sub: userId, tokenVersion };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};