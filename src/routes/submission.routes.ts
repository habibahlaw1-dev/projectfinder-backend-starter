import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { submitDeliverable } from "../controllers/submission.controller";

const router = Router();

router.post(
  "/projects/:projectId/deliverables/:deliverableId/submissions",
  authenticate,
  upload.single("file"),
  submitDeliverable
);

export default router;