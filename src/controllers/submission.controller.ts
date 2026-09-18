import { Request, Response } from "express";
import path from "node:path";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";

export async function submitDeliverable(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, "A deliverable file is required");

  const project = await prisma.project.findFirst({
    where: { id: req.params.projectId, status: "PUBLISHED" },
  });
  if (!project) throw new HttpError(404, "Project not found");

  const deliverable = await prisma.deliverable.findFirst({
    where: { id: req.params.deliverableId, projectId: project.id },
  });
  if (!deliverable) throw new HttpError(404, "Deliverable not found");

  const selection = await prisma.projectSelection.findUnique({
    where: {
      userId_projectId: {
        userId: req.auth!.userId,
        projectId: project.id,
      },
    },
  });
  if (!selection) throw new HttpError(400, "Start the project before submitting work");

  const submission = await prisma.submission.create({
    data: {
      userId: req.auth!.userId,
      projectId: project.id,
      deliverableId: deliverable.id,
      fileUrl: `/uploads/${path.basename(req.file.path)}`,
      fileName: req.file.originalname,
    },
  });

  res.status(201).json({ data: submission });
}