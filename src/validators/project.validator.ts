import { z } from "zod";

const difficulty = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const createProjectSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(1),
  companyName: z.string().trim().optional(),
  scenario: z.string().trim().min(1),
  businessProblem: z.string().trim().min(1),
  objective: z.string().trim().min(1),
  context: z.string().trim().optional(),
  userRole: z.string().trim().optional(),
  difficulty,
  industryId: z.string().uuid(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  industry: z.string().trim().optional(),
  difficulty,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});