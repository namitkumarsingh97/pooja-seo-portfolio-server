/* eslint-env node */
/* global process */
import jwt from "jsonwebtoken";

const SERVICE_JWT_SECRET =
  process.env.SERVICE_JWT_SECRET || process.env.SVC_JWT_SECRET || "";

const ensureSecret = () => {
  if (!SERVICE_JWT_SECRET) {
    throw new Error("Missing SERVICE_JWT_SECRET env for JWT validation");
  }
  return SERVICE_JWT_SECRET;
};

export const signServiceToken = (payload, options = {}) => {
  const secret = ensureSecret();
  return jwt.sign(payload, secret, { expiresIn: "15m", ...options });
};

export const verifyServiceToken = (token) => {
  const secret = ensureSecret();
  return jwt.verify(token, secret);
};

