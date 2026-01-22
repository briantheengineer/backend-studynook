import express from "express";
import authRoutes from "./routes/auth.routes.js";
import deckRoutes from "./routes/deck.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true });
})

app.use("/auth", authRoutes);
app.use("/decks", deckRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

