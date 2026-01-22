import express from "express";
import router from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true });
})

app.use("/auth", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

