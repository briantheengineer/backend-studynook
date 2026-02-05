import { Router } from "express";
import { createDeck, listDecks, deleteDeck, getDeck } from "../controllers/deck.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import flashcardRoutes from "./flashcard.routes.js";

const router = Router();

router.post("/", authMiddleware, createDeck);
router.get("/", authMiddleware, listDecks);
router.delete("/:deckId", authMiddleware, deleteDeck);
router.use("/:deckId/flashcards", flashcardRoutes);
router.get("/:deckId", authMiddleware, getDeck);


export default router;
