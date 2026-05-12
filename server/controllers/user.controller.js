import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { hashPassword } from "../lib/hash.js";
import crypto from "crypto";
import { createAccessToken, createRefreshToken } from "../lib/token.js";

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    throw new Error("Google client id and secret both are missing");
  }

  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
};

// google auth
export const googleAuthStartHandler = async (req, res) => {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.redirect(url);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const googleAuthCallbackHandler = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      message: "Missing code in callback ",
    });
  }
  try {
    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);
    //  console.log(tokens, code, "code");

    if (!tokens.id_token) {
      return res.status(400).json({
        message: "No googles is_token is present",
      });
    }

    //  verify is token and read the user info from it
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name;
    const picture = payload?.picture;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(400).json({
        message: "Google email account is not verified",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = await hashPassword(randomPassword);

      user = await User.create({
        email: normalizedEmail,
        password: passwordHash,
        name: name,
        picture: picture,
      });
    }

    const accessToken = createAccessToken(user.id, user.name, user.tokenVersion);
    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    // set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("http://localhost:3000");

    // return res.json({
    //   message: "Google login successfully",
    //   accessToken,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //     picture: user.picture,
    //   },
    // });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

// refresh handler
export const refreshHandler = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Refresh token invalidate!" });
    }

    const newAccessToken = createAccessToken(user.id, user.name, user.tokenVersion);

    const newRefreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    // set cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

// logout handler
export const logoutHandler = async (req, res) => {
  // res.clearCookie("refreshToken", { path: "/" });

  const isProd = process.env.NODE_ENV === "production"
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json({
    message: "Logged out",
  });
};

// get user information
export const getUserInfoHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};
