/* eslint-env node */
/* global process */
import crypto from "crypto";

const DEFAULT_TTL_MS = Number(
  process.env.ADMIN_SESSION_TTL_MS || 1000 * 60 * 60
); // 1 hour
export const SESSION_COOKIE_NAME = "adminSession";

const sessions = new Map();

const now = () => Date.now();

const purgeExpired = () => {
  const current = now();
  for (const [token, { expiresAt }] of sessions.entries()) {
    if (expiresAt <= current) {
      sessions.delete(token);
    }
  }
};

export const getSessionTtlMs = () => DEFAULT_TTL_MS;

export const createSession = () => {
  purgeExpired();
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { createdAt: now(), expiresAt: now() + DEFAULT_TTL_MS });
  return token;
};

export const revokeSession = (token) => {
  sessions.delete(token);
};

export const isValidSessionToken = (token) => {
  purgeExpired();
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (session.expiresAt <= now()) {
    sessions.delete(token);
    return false;
  }
  return true;
};

