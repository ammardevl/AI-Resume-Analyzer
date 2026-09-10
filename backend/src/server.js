import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initDb } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

const REQUIRED_ENV = ["JWT_SECRET"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}. See .env.example.`);
    process.exit(1);
  }
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "ANTHROPIC_API_KEY is not set — resumes will be scored with the lightweight offline fallback analyzer instead of real AI feedback.",
  );
}

await initDb();

const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  }),
);

app.use(express.json({ limit: "1mb" }));

// A generous global limit; the auth and upload routes have their own
// stricter limits layered on top of this.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(
  "/uploads",
  express.static(UPLOAD_ROOT, {
    maxAge: "7d",
    setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"),
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found." });
});

// Centralized error handler — keeps stack traces out of responses and
// turns Multer/validation errors into clean JSON messages.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed." });
  }
  if (err && err.message && /must be a|Unexpected file/.test(err.message)) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Resumind backend listening on port ${PORT}`);
});
