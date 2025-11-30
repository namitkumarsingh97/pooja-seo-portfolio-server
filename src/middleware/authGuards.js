/* eslint-env node */
import {
  isValidSessionToken,
  SESSION_COOKIE_NAME,
} from "../models/AdminSession.js";
import { verifyServiceToken } from "../utils/jwt.js";

const parseCookies = (req) => {
  const header = req.headers?.cookie || "";
  return header.split(";").reduce((acc, pair) => {
    const [rawKey, ...rest] = pair.trim().split("=");
    if (!rawKey) return acc;
    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rest.join("=") || "");
    return acc;
  }, {});
};

const getCookieToken = (req) => {
  const cookies = parseCookies(req);
  return cookies[SESSION_COOKIE_NAME] || null;
};

const getBearerToken = (req) => {
  const header = req.headers.authorization || "";
  return header.replace("Bearer ", "").trim();
};

export const requireAdminSessionOnly = (req, res, next) => {
  const token = getCookieToken(req);
  if (!token || !isValidSessionToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.adminToken = token;
  return next();
};

export const requireAdminSessionOrServiceJwt = (req, res, next) => {
  const cookieToken = getCookieToken(req);
  if (cookieToken && isValidSessionToken(cookieToken)) {
    req.adminToken = cookieToken;
    req.authSource = "admin";
    return next();
  }

  const bearer = getBearerToken(req);
  if (bearer) {
    try {
      req.serviceClaims = verifyServiceToken(bearer);
      req.authSource = "service";
      return next();
    } catch (error) {
      console.error("Service JWT verification failed", error);
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};

