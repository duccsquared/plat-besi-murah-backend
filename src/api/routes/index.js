import express from "express";
import testCategoryRoutes from "./testCategory.js";
import productsRoutes from "./products.js";
import articleRoutes from "./articles.js"
import authRoutes from "./auth.js";

const router = express.Router();

router.use("/testCategory", testCategoryRoutes);
router.use("/products", productsRoutes);
router.use("/article", articleRoutes);
router.use("/auth", authRoutes);

export default router;
