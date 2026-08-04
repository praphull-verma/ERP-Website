// app.ts
import express from "express";
import { signup } from "./routes/auth/signup";
import { login } from "./routes/auth/login";
import "dotenv/config";
import { log } from "node:console";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = await signup(req.body);
    res.json(user);
    console.log("New user signed-up.")
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
    console.log("Login succesful")

  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));