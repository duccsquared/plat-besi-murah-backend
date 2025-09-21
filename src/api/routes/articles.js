import express from "express";
import { getArticle, createArticle, updateArticle, deleteArticle } from "../controllers/articles/index.js";

const router = express.Router();

router.get("/", getArticle);
router.post("/", createArticle);
router.put("/", updateArticle);
router.delete("/", deleteArticle);

export default router;
