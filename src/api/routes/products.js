import express from "express";
import { getProduct, getProductList } from "../controllers/products/index.js";

const router = express.Router();

router.get("/", getProduct);
router.get("/list", getProductList);

export default router;
