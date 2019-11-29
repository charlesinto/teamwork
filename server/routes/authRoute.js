import express from "express";
import AuthMiddleware from "../middleware/Auth";
import {createUserWithEmailandPassword, signInWithUsernameandPassword} from "../controller/AuthController";
const router = express.Router()

router.post('/create-user', AuthMiddleware.validateEmailandPassword, 
    AuthMiddleware.validateRequestParams,AuthMiddleware.validateToken,AuthMiddleware.validateIsAdmin,
     createUserWithEmailandPassword )

router.post('/signin', AuthMiddleware.validateUsernameAndPassword, signInWithUsernameandPassword)

export default router;