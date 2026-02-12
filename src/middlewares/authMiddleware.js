import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tokenBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (tokenBlacklisted) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}