import express from "express";
import testCategoryRoutes from "./testCategory.js";
import productsRoutes from "./products.js";
import articleRoutes from "./articles.js"

const router = express.Router();

router.use("/testCategory", testCategoryRoutes);
router.use("/products", productsRoutes);
router.use("/article", articleRoutes);

export default router;
