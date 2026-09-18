import { Router } from "express";
import { Role } from "@prisma/client";
import {
  createProject,
  getProject,
  listProjects,
  publishProject,
  startProject,
  unpublishProject,
  updateProject,
} from "../controllers/project.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { addDeliverable, addTask } from "../controllers/admin.controller";

const router = Router();

router.get("/", listProjects);
router.get("/:id", getProject);

router.post("/", authenticate, authorize(Role.ADMIN), createProject);
router.patch("/:id", authenticate, authorize(Role.ADMIN), updateProject);
router.post("/:id/publish", authenticate, authorize(Role.ADMIN), publishProject);
router.post("/:id/unpublish", authenticate, authorize(Role.ADMIN), unpublishProject);

router.post("/:id/start", authenticate, startProject);
router.post("/:projectId/tasks", authenticate, authorize(Role.ADMIN), addTask);
router.post("/:projectId/deliverables", authenticate, authorize(Role.ADMIN), addDeliverable);

export default router;