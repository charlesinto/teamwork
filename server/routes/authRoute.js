import express from "express";
import AuthMiddleware from "../middleware/Auth";
import {createUserWithEmailandPassword, signInWithEmailandPassword} from "../controller/AuthController";
const router = express.Router()

router.post('/create-user', AuthMiddleware.validateEmailandPassword, 
    AuthMiddleware.validateRequestParams,createUserWithEmailandPassword )

router.post('/signin', AuthMiddleware.validateEmailandPassword, signInWithEmailandPassword)

export default router;