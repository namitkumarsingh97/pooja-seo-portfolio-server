/* eslint-env node */
import express from "express";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { requireAdminSessionOrServiceJwt } from "../middleware/authGuards.js";

const router = express.Router();

router.get("/", listPosts);
router.get("/:slug", getPost);

// Admin guard middleware
router.post("/", requireAdminSessionOrServiceJwt, createPost);
router.put("/:id", requireAdminSessionOrServiceJwt, updatePost);
router.delete("/:id", requireAdminSessionOrServiceJwt, deletePost);

export default router;

