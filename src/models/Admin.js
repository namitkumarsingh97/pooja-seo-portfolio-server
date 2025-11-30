/* eslint-env node */
/* global process */
import "dotenv/config";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const ensureAdminEnv = () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables"
    );
  }
};

export const getAdminProfile = () => {
  ensureAdminEnv();
  return {
    id: "pooja-seo-admin",
    name: "Pooja SEO",
    email: ADMIN_EMAIL,
  };
};

export const isValidAdminCredentials = (email, password) => {
  ensureAdminEnv();
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};

