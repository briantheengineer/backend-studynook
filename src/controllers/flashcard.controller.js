import prisma from "../lib/prisma.js";

export async function createFlashcard(req, res) {
  try {
    const { front, back } = req.body;
    const { deckId } = req.params;
    const userId = req.userId;

    if (!front || !back) {
      return res.status(400).json({ error: "Front e back são obrigatórios" });
    }

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId
      }
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck não encontrado" });
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        deckId,
        userId
      }
    });

    return res.status(201).json(flashcard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar flashcard" });
  }
}

export async function listFlashcards(req, res) {
  try {
    const { deckId } = req.params;
    const userId = req.userId;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId
      }
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck não encontrado" });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: {
        deckId,
        userId
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return res.json(flashcards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar flashcards" });
  }
}

export async function deleteFlashcard(req, res) {
  try {
    const { deckId, flashcardId } = req.params;
    const userId = req.userId;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId
      }
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck não encontrado" });
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        deckId,
        userId
      }
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard não encontrado" });
    }

    await prisma.flashcard.delete({
      where: {
        id: flashcardId
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar flashcard" });
  }
}

export async function updateFlashcard(req, res) {
  try {
    const { deckId, flashcardId } = req.params;
    const { front, back } = req.body;
    const userId = req.userId;

    if (!front && !back) {
      return res.status(400).json({
        error: "Informe pelo menos front ou back para atualizar"
      });
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        deckId,
        userId
      }
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard não encontrado" });
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: {
        id: flashcardId
      },
      data: {
        front: front ?? flashcard.front,
        back: back ?? flashcard.back
      }
    });

    return res.json(updatedFlashcard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar flashcard" });
  }
}