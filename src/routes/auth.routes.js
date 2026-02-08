import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken"
import crypto from "crypto";
import { Resend } from "resend";




const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

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
      return res.status(401).json({ error: "Use outro email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: false
      },
    });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
      }
    });

    await resend.emails.send({
      from: "StudyNook <onboarding@resend.dev>",
      to: user.email,
      subject: "Verify your email",
      html: `
        <h2>Bem vindo ao StudyNook!</h2>
        <p>Clique abaixo para verificar seu email:</p>
        <a href="${process.env.APP_URL}/verify-email?token=${token}">
      `
    });

    return res.status(201).json({
      message: "Usuário criado! Verifique seu email 📩"
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
      return res.status(400).json({ error: "Email e senha obrigatorios"})
    }

    const user = await prisma.user.findUnique({ where: { email }})

    if (!user){
     return res.status(400).json({ error: "Email ou senha incorreta"})
    };

    if (!user.emailVerified) {
      return res.status(403).json({
      error: "Verifique seu email antes de entrar."
      });
}

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Email ou senha incorreta"})
    }

    const token = jwt.sign(
      { userId: user.id },
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

  router.post("/logout", authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  const decoded = jwt.decode(token);

  await prisma.blacklistedToken.create({
    data: {
      token,
      expiresAt: new Date(decoded.exp * 1000)
    }
  });

  return res.status(200).json({ message: "Logout realizado com sucesso" });
});

export default router;
