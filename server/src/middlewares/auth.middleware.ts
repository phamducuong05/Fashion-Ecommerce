import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include user property
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Get token from header (Format: "Bearer eyJhbGci...")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing Token" });
  }

  // 2. Verify token
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token is invalid or expired" });
    }

    // 3. Save user info (id, email, role) to request for later use
    req.user = user;

    next();
  });
};
