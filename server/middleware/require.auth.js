
import { verifyAccessToken } from "../lib/token.js";
import User from "../models/user.model.js";

 const requireAuth = async (
  req,
  res,
  next,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "You are not auth user! you can't enter!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found! you can't enter!" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Token invalidate!" });
    }

    const authReq = req ;
    authReq.user = {
      id: user.id,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

export default requireAuth;