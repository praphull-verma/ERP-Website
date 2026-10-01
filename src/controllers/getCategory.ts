import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // Adjust import based on your setup

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Fetch all categories from your database
    const categories = await prisma.category.findMany({
      // Optional: you can sort them by creation date or name
      orderBy: { createdAt: 'desc' } 
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
