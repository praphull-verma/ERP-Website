import express from "express";
import { getCategories } from "../controllers/getCategory";
import { searchCategory } from "./searchCategory";

const categoryRoute = express.Router();

// Add the GET route
categoryRoute.get("/", getCategories);


categoryRoute.get("/search", async (req, res) => {
    try {
        const key = req.query.name;
        if (typeof key !== "string" || !key.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const category = await searchCategory(key);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json(category);

    } catch (error) {
         console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

export default categoryRoute;
