import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import postsRouter from "./src/routes/posts.js";
import adminRouter from "./src/routes/admin.js";

dotenv.config();

const app = express();

// CORS configuration - allow frontend domain
const allowedOrigins = process.env.CORS_ALLOW_ORIGINS
  ? process.env.CORS_ALLOW_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "https://pooja-seo-portfolio.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Pooja SEO Portfolio API" });
});

app.use("/api/posts", postsRouter);
app.use("/api/admin", adminRouter);

export default app;
