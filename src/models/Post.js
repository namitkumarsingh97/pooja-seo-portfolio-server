import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    heroImage: { type: String },
    tags: [{ type: String }],
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);

