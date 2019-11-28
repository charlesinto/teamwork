import express from "express";
import AuthMiddleware from "../middleware/Auth";
import {createUserWithEmailandPassword} from "../controller/AuthController";
const router = express.Router()

router.post('/create-user', AuthMiddleware.validateEmailandPassword, 
    AuthMiddleware.validateRequestParams,createUserWithEmailandPassword )


export default router;