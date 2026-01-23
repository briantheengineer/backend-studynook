import prisma from "../lib/prisma.js";

export async function createDeck(req, res) {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ error: "Nome do deck é obrigatório" });
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        userId
      }
    });

    return res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar deck" });
  }
}

export async function listDecks(req, res) {
  try {
    const userId = req.userId;

    const decks = await prisma.deck.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json(decks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar decks" });
  }
}
