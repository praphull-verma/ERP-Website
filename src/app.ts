// app.ts
import express from "express";
import { signup } from "./routes/auth/signup";
import { login } from "./routes/auth/login";
import "dotenv/config";
import cors from "cors";

import { LoginToken, signToken } from "./lib/auth/jwt";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/requireAuth";
import { prisma } from "./lib/prisma"


const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Next.js frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/me", requireAuth, async (req, res) => {
  const { id } = (req as any).user;
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { password, ...safeUser } = user;
  res.json(safeUser);
});


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
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});




app.post("/login", async (req, res) => {
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
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));