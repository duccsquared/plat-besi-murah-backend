import express from "express";
import { addition } from "../controllers/testCategory/addition.js";

const router = express.Router();

router.post("/addition", addition);

export default router;
