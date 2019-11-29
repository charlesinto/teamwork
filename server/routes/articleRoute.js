import express from "express";
import AuthMiddleware from "../middleware/Auth";
import { validateArticle, validateArticleUpdate, validateComment } from "../middleware/articleMiddleware";
import { createArticle, updateArticle, deleteArticle, commentOnArticle, getArticle
 } from "../controller/articelController";

const router = express.Router()

router.post('/', AuthMiddleware.validateToken, validateArticle, createArticle)
router.patch('/:id', AuthMiddleware.validateToken, validateArticleUpdate, updateArticle )
router.delete('/:id', AuthMiddleware.validateToken, deleteArticle )
router.post('/:id/comment', AuthMiddleware.validateToken, validateComment, commentOnArticle )
router.get('/:id',AuthMiddleware.validateToken, getArticle)

export default router;