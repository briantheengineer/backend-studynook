import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({ dest: "temp/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "flashcards",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no upload" });
  }
});

export default router;