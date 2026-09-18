import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import submissionRoutes from "./routes/submission.routes";
import adminRoutes from "./routes/admin.routes";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", service: "projectfinder-backend" });
});

app.use("/uploads", express.static(path.resolve(env.uploadDir)));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1", submissionRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;