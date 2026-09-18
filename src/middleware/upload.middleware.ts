import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env";

fs.mkdirSync(env.uploadDir, { recursive: true });

const allowedExtensions = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"
]);

export const upload = multer({
  dest: env.uploadDir,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(extension)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});