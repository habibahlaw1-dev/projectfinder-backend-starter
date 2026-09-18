import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";

export async function createIndustry(req: Request, res: Response) {
  const name = String(req.body.name ?? "").trim();
  if (!name) throw new HttpError(400, "Industry name is required");

  const industry = await prisma.industry.create({ data: { name } });
  res.status(201).json({ data: industry });
}

export async function addTask(req: Request, res: Response) {
  const { title, description, order } = req.body;
  const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
  if (!project) throw new HttpError(404, "Project not found");

  const task = await prisma.task.create({
    data: {
      projectId: project.id,
      title: String(title),
      description: String(description ?? ""),
      order: Number(order ?? 1),
    },
  });
  res.status(201).json({ data: task });
}

export async function addDeliverable(req: Request, res: Response) {
  const { title, description, required, submissionType } = req.body;
  const project = await prisma.project.findUnique({ where: { id: req.params.projectId } });
  if (!project) throw new HttpError(404, "Project not found");

  const deliverable = await prisma.deliverable.create({
    data: {
      projectId: project.id,
      title: String(title),
      description: description ? String(description) : undefined,
      required: required !== false,
      submissionType: String(submissionType ?? "FILE"),
    },
  });
  res.status(201).json({ data: deliverable });
}