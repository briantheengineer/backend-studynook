import { Router } from "express";
import {
  createFlashcard,
  listFlashcards, 
  deleteFlashcard,
  updateFlashcard, 
  reviewFlashcard
} from "../controllers/flashcard.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, createFlashcard);
router.get("/", authMiddleware, listFlashcards);
router.delete("/:flashcardId", authMiddleware, deleteFlashcard);
router.put("/:flascardId", authMiddleware, updateFlashcard);
router.post("/:flashcardId/review", authMiddleware, reviewFlashcard);


export default router;
