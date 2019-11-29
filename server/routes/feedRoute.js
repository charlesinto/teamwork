import express from "express";
import Auth from "../middleware/Auth";
import { getAllArtilce } from "../controller/articelController";

const router = express.Router()


router.get('/', Auth.validateToken, getAllArtilce )

export default router;