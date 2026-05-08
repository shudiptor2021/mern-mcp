import jwt from "jsonwebtoken";

// create access token
export const createAccessToken = (
  userId,
  name
) => {
  const payload = { sub: userId, name };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
};

// verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
};

// create refresh token
export const createRefreshToken = (userId) => {
  const payload = { sub: userId };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "7d",
  });
};

// verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
};