import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { v4 as uuid } from "uuid";
import rateLimit from "express-rate-limit";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { analyzeResume } from "../services/ai.service.js";
import { sanitizeText } from "../utils/validators.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads");
const PDF_DIR = path.join(UPLOAD_ROOT, "pdfs");
const IMAGE_DIR = path.join(UPLOAD_ROOT, "images");

await fs.mkdir(PDF_DIR, { recursive: true });
await fs.mkdir(IMAGE_DIR, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Resume must be a PDF file."));
      }
    } else if (file.fieldname === "image") {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
        return cb(new Error("Preview image must be a PNG, JPEG or WebP."));
      }
    } else {
      return cb(new Error("Unexpected file field."));
    }
    cb(null, true);
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many uploads. Please slow down and try again shortly." },
});

const router = Router();
router.use(requireAuth);

function toRecord(resume) {
  // Strip the userId before sending to the client.
  const { userId, ...rest } = resume;
  return rest;
}

router.get("/", async (req, res) => {
  await db.read();
  const resumes = db.data.resumes
    .filter((r) => r.userId === req.userId)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .map(toRecord);
  res.json({ resumes });
});

router.get("/:id", async (req, res) => {
  await db.read();
  const resume = db.data.resumes.find(
    (r) => r.id === req.params.id && r.userId === req.userId,
  );
  if (!resume) return res.status(404).json({ message: "Resume not found." });
  res.json({ resume: toRecord(resume) });
});

router.delete("/:id", async (req, res) => {
  await db.read();
  const index = db.data.resumes.findIndex(
    (r) => r.id === req.params.id && r.userId === req.userId,
  );
  if (index === -1) return res.status(404).json({ message: "Resume not found." });

  const [removed] = db.data.resumes.splice(index, 1);
  await db.write();

  await Promise.allSettled([
    fs.unlink(path.join(UPLOAD_ROOT, removed.resumePath.replace("/uploads/", ""))),
    fs.unlink(path.join(UPLOAD_ROOT, removed.imagePath.replace("/uploads/", ""))),
  ]);

  res.json({ success: true });
});

router.post(
  "/",
  uploadLimiter,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const resumeFile = req.files?.resume?.[0];
      const imageFile = req.files?.image?.[0];

      if (!resumeFile || !imageFile) {
        return res.status(400).json({ message: "Both a resume PDF and a preview image are required." });
      }

      const companyName = sanitizeText(req.body.companyName, 200);
      const jobTitle = sanitizeText(req.body.jobTitle, 200);
      const jobDescription = sanitizeText(req.body.jobDescription, 6000);

      const id = uuid();
      const pdfFilename = `${id}.pdf`;
      const imageExt = imageFile.mimetype === "image/png" ? "png" : imageFile.mimetype === "image/webp" ? "webp" : "jpg";
      const imageFilename = `${id}.${imageExt}`;

      await fs.writeFile(path.join(PDF_DIR, pdfFilename), resumeFile.buffer);
      await fs.writeFile(path.join(IMAGE_DIR, imageFilename), imageFile.buffer);

      let resumeText = "";
      try {
        const { default: pdfParse } = await import("pdf-parse");
        const parsed = await pdfParse(resumeFile.buffer);
        resumeText = parsed.text || "";
      } catch (err) {
        console.error("PDF text extraction failed:", err.message);
      }

      let feedback;
      try {
        feedback = await analyzeResume({ resumeText, jobTitle, jobDescription });
      } catch (err) {
        console.error("AI analysis failed:", err.message);
        return res.status(502).json({
          message: "The AI analysis service is currently unavailable. Please try again in a moment.",
        });
      }

      const resume = {
        id,
        userId: req.userId,
        companyName,
        jobTitle,
        jobDescription,
        resumePath: `/uploads/pdfs/${pdfFilename}`,
        imagePath: `/uploads/images/${imageFilename}`,
        feedback,
        createdAt: new Date().toISOString(),
      };

      await db.read();
      db.data.resumes.push(resume);
      await db.write();

      res.status(201).json({ resume: toRecord(resume) });
    } catch (err) {
      console.error("Resume upload failed:", err);
      res.status(500).json({ message: "Something went wrong while processing your resume." });
    }
  },
);

export default router;
