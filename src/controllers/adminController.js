/* eslint-env node */
/* global process */
import { getAdminProfile, isValidAdminCredentials } from "../models/Admin.js";
import {
  createSession,
  revokeSession,
  SESSION_COOKIE_NAME,
  getSessionTtlMs,
} from "../models/AdminSession.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  path: "/",
};

const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: getSessionTtlMs(),
  });
};

const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
};

export const loginAdmin = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required for login." });
  }

  if (!isValidAdminCredentials(email, password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  try {
    const token = createSession();
    setSessionCookie(res, token);
    return res.json({
      profile: getAdminProfile(),
    });
  } catch (error) {
    console.error("Admin login error", error);
    return res.status(500).json({ message: "Unable to create session." });
  }
};

export const logoutAdmin = (req, res) => {
  if (req.adminToken) {
    revokeSession(req.adminToken);
  }
  clearSessionCookie(res);
  return res.json({ message: "Logged out." });
};

export const getAdminSession = (_req, res) => {
  return res.json({ profile: getAdminProfile() });
};

