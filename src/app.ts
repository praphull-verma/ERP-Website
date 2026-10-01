// app.ts
import express from "express";
import { signup } from "./routes/auth/signup";
import { login } from "./routes/auth/login";
import "dotenv/config";
import cors from "cors";
import { upload } from "./middleware/multer";
import { LoginToken, signToken } from "./lib/auth/jwt";
import { uploadOnCloudinary } from "./utils/media-upload/cloudinaryUtil";
import cookieParser from "cookie-parser";
import { requireAuth } from "./middleware/requireAuth";
import { prisma } from "./lib/prisma"
import fs from "fs/promises";
import { uploadMedia } from "./routes/media/upload";
import { createCategory } from "./routes/category";
import categoryRoute from "./routes/categoryRoute";


const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Next.js frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/categories",categoryRoute ); 


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

app.post("/upload",upload.single("file"),async (req, res)=>{
  try {

    if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded",
                });
              }
  
    const cloudinaryResponse = await uploadMedia(req.file.path, req.body.type);

            return res.status(200).json({
                message: "Upload successful",
                url: cloudinaryResponse.url,
                filename:cloudinaryResponse.filename,
            });
  
  } catch (error) {
     console.error(error);
            return res.status(500).json({
                message: "Upload failed",
            });
        
  }
})


app.post(
    "/categories",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Category image is required",
                });
            }

            const { name, resourceCount } = req.body;

            if (!name?.trim()) {
                return res.status(400).json({
                    message: "Category name is required",
                });
            }

            const count = Number(resourceCount);

            if (!Number.isInteger(count) || count < 0) {
                return res.status(400).json({
                    message: "Invalid resource count",
                });
            }

            const category = await createCategory(
                name,
                count,
                req.file.path
            );

            return res.status(201).json(category);

        } catch (error: any) {
            console.error(error);

            return res.status(500).json({
                message: error.message || "Failed to create category",
            });
        }
    }
);


app.listen(3001, () => console.log("Server running on port 3001"));