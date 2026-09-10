import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import rateLimit from "express-rate-limit";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { isValidEmail, isValidPassword, isValidName } from "../utils/validators.js";

const router = Router();

// Auth endpoints are the most likely target for brute-forcing / abuse,
// so they get a tighter rate limit than the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function signToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

router.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Please enter your full name." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  await db.read();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.data.users.find((u) => u.email === normalizedEmail);
  if (exists) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    id: uuid(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  return res.status(201).json({ user: toPublicUser(user), token: signToken(user) });
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (!isValidEmail(email) || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  await db.read();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.data.users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({ user: toPublicUser(user), token: signToken(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user: toPublicUser(user) });
});

export default router;
