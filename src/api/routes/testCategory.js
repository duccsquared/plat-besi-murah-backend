import express from "express";
import { addition, runSql } from "../controllers/testCategory/index.js";

const router = express.Router();

router.post("/addition", addition);
router.post("/runSql", runSql);

export default router;
