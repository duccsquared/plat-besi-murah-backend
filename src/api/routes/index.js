import express from "express";
import testCategoryRoutes from "./testCategory.js";

const router = express.Router();

router.use("/testCategory", testCategoryRoutes);

export default router;
