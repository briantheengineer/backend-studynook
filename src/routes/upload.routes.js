import express from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "flashcards" },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Erro no upload" });
        }

        return res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;