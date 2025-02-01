import express from "express";
import testCategoryRoutes from "./testCategory.js";
import productsRoutes from "./products.js";

const router = express.Router();

router.use("/testCategory", testCategoryRoutes);
router.use("/products", productsRoutes);

export default router;
