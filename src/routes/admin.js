/* eslint-env node */
import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAdminSession,
} from "../controllers/adminController.js";
import { listAllPosts } from "../controllers/postController.js";
import { requireAdminSessionOnly } from "../middleware/authGuards.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", requireAdminSessionOnly, logoutAdmin);
router.get("/session", requireAdminSessionOnly, getAdminSession);
router.get("/posts", requireAdminSessionOnly, listAllPosts);

export default router;
