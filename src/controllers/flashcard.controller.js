import prisma from "../lib/prisma.js";

export async function createFlashcard(req, res) {
  try {
    const { deckId } = req.params;
    const { front, back, imageUrl } = req.body;
    const userId = req.Id;

    const flashcard = await prisma.flashcard.create({
      data: {
        front,
        back,
        imageUrl,
        deckId,
        userId,
        difficulty: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: new Date(),
      },
    });

    res.status(201).json(flashcard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar flashcard" });
  }
}

export async function listFlashcards(req, res) {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    const flashcards = await prisma.flashcard.findMany({
      where: {
        deckId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar flashcards" });
  }
}

export async function deleteFlashcard(req, res) {
  try {
    const { flashcardId } = req.params;
    const userId = req.user.id;

    await prisma.flashcard.delete({
      where: {
        id: flashcardId,
        userId,
      },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Erro ao deletar flashcard" });
  }
}

export async function updateFlashcard(req, res) {
  try {
    const { flashcardId } = req.params;
    const { front, back, imageUrl } = req.body;
    const userId = req.user.id;

    const updated = await prisma.flashcard.update({
      where: {
        id: flashcardId,
        userId,
      },
      data: {
        front,
        back,
        imageUrl,
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar flashcard" });
  }
}

export async function reviewFlashcard(req, res) {
  try {
    const { flashcardId } = req.params;
    const { quality } = req.body; 
    const userId = req.user.id;

    const card = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        userId,
      },
    });

    if (!card) {
      return res.status(404).json({ error: "Flashcard não encontrado" });
    }

    let { difficulty, interval, repetitions } = card;

    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;

      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * difficulty);
    }

    difficulty =
      difficulty +
      (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (difficulty < 1.3) difficulty = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const updated = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        difficulty,
        interval,
        repetitions,
        nextReview,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao revisar flashcard" });
  }
}