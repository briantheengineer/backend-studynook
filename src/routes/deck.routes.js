import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Título obrigatório" });
  }

  const deck = await prisma.deck.create({
    data: {
      title,
      userId: req.userId
    }
  });

  return res.status(201).json(deck);
});


router.get("/", authMiddleware, async (req, res) => {
  const decks = await prisma.deck.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json(decks);
});

export default router;
