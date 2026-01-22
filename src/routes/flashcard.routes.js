import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router()


//create a flashcard
router.post("/")