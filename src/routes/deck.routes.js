import { Router } from "express";
import { createDeck, listDecks } from "../controllers/deck.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import flashcardRoutes from "./flashcard.routes.js";

const router = Router();

router.post("/", authMiddleware, createDeck);
router.get("/", authMiddleware, listDecks);
router.use("/:deckId/flashcards", flashcardRoutes);

export default router;
