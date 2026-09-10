import { clsx, type ClassValue } from "clsx";

// Small helper to join conditional class names. We no longer need
// tailwind-merge since the design system is hand-written CSS with no
// conflicting utility classes to resolve.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();
