/* eslint-env node */
import Post from "../models/Post.js";

const publishedFilter = {
  $or: [
    { status: "published" },
    { status: { $exists: false }, published: { $ne: false } },
  ],
};

const normalizePayload = (payload = {}) => {
  const next = { ...payload };
  if (next.status) {
    next.published = next.status === "published";
  } else if (typeof next.published === "boolean" && !next.status) {
    next.status = next.published ? "published" : "draft";
  }
  return next;
};

export const listPosts = async (_req, res) => {
  try {
    const posts = await Post.find(publishedFilter).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    const isPublished =
      post &&
      (post.status === "published" ||
        (!post.status && post.published !== false));
    if (!post || !isPublished) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error });
  }
};

export const listAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin posts", error });
  }
};

export const createPost = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const post = await Post.create(payload);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Failed to create post", error });
  }
};

export const updatePost = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const updated = await Post.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update post", error });
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete post", error });
  }
};

