// app.ts
import express from "express";
import { signup } from "./routes/auth/signup";
import { login } from "./routes/auth/login";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/requireAuth";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
    try {
        const { user, token } = await signup(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json(user);
        console.log("New user signed-up.");
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
app.post("/login", requireAuth, async (req, res) => {
    try {
        const { user, token } = await login(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json(user);
        console.log("Login successful");
    }
    catch (e) {
        res.status(401).json({ error: e.message });
    }
});
app.listen(3001, () => console.log("Server running on port 3001"));
