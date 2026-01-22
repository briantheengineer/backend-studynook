import { Router } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken"

const router = Router();

router.get("/", (req, res) => {
  res.json({ ok: true });
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      return res.status(400).json({ error: "Use outro email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/login", async (req,res) => {
    try {
    const {email, password} = req.body;

    if (!email || !password){
      return res.error(400).json({ error: "Email e senha obrigatorios"})
    }

    const user = await prisma.user.findUnique({ where: { email }})

    if (!user){
     return res.error(400).json({ error: "Email ou senha incorreta"})
    };

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.error(400).json({ error: "Email ou senha incorreta"})
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
      
    } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
})

export default router;
