import express from "express";
import { getCategories } from "../controllers/getCategory";

const categoryRoute = express.Router();

// Add the GET route
categoryRoute.get("/", getCategories);

export default categoryRoute;
