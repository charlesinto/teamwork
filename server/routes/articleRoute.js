import express from "express";
import AuthMiddleware from "../middleware/Auth";
import { validateArticle } from "../middleware/articleMiddleware";
import { createArticle } from "../controller/articelController";

const router = express.Router()

router.post('/', AuthMiddleware.validateToken, validateArticle, createArticle)

export default router;