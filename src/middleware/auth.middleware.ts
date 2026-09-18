import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { HttpError } from "../utils/http-error";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication required"));
  }

  try {
    req.auth = verifyToken(header.substring(7));
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new HttpError(401, "Authentication required"));
    if (!roles.includes(req.auth.role)) {
      return next(new HttpError(403, "Insufficient permissions"));
    }
    next();
  };
}