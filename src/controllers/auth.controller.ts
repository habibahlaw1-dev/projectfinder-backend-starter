import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) throw new HttpError(409, "Email already registered");

  const password = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ user, token });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await comparePassword(data.password, user.password))) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}