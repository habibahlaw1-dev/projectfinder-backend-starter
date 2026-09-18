import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from "../validators/project.validator";
import { HttpError } from "../utils/http-error";

export async function listProjects(req: Request, res: Response) {
  const query = projectQuerySchema.parse(req.query);
  const where: any = { status: "PUBLISHED" };

  if (query.difficulty) where.difficulty = query.difficulty;
  if (query.industry) {
    where.industry = { name: { equals: query.industry, mode: "insensitive" } };
  }

  const skip = (query.page - 1) * query.limit;
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { publishedAt: "desc" },
      include: { industry: true },
    }),
    prisma.project.count({ where }),
  ]);

  res.json({
    data: projects,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  });
}

export async function getProject(req: Request, res: Response) {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, status: "PUBLISHED" },
    include: {
      industry: true,
      tasks: { orderBy: { order: "asc" } },
      deliverables: true,
    },
  });

  if (!project) throw new HttpError(404, "Project not found");
  res.json({ data: project });
}

export async function createProject(req: Request, res: Response) {
  const data = createProjectSchema.parse(req.body);

  const industry = await prisma.industry.findUnique({ where: { id: data.industryId } });
  if (!industry) throw new HttpError(400, "Industry not found");

  const project = await prisma.project.create({ data });
  res.status(201).json({ data: project });
}

export async function updateProject(req: Request, res: Response) {
  const data = updateProjectSchema.parse(req.body);

  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "Project not found");

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data,
  });

  res.json({ data: project });
}

export async function publishProject(req: Request, res: Response) {
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "Project not found");

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  res.json({ data: project });
}

export async function unpublishProject(req: Request, res: Response) {
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new HttpError(404, "Project not found");

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { status: "UNPUBLISHED" },
  });

  res.json({ data: project });
}

export async function startProject(req: Request, res: Response) {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, status: "PUBLISHED" },
  });
  if (!project) throw new HttpError(404, "Project not found");

  const selection = await prisma.projectSelection.upsert({
    where: {
      userId_projectId: {
        userId: req.auth!.userId,
        projectId: project.id,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      userId: req.auth!.userId,
      projectId: project.id,
    },
  });

  res.status(201).json({ data: selection });
}