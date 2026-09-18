import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { createIndustry } from "../controllers/admin.controller";

const router = Router();

router.post("/industries", authenticate, authorize(Role.ADMIN), createIndustry);

export default router;