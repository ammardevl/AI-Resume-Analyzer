const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim());
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

export function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2 && name.trim().length <= 80;
}

// Basic sanitizer for free-text fields the user submits (company name,
// job title/description). Strips control characters and enforces a
// sane max length so a user can't stuff megabytes of text into the DB.
export function sanitizeText(value, maxLength = 5000) {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}
