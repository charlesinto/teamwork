import express from "express";
import AuthMiddleware from "../middleware/Auth";
import AuthController from "../controller/AuthController";
const router = express.Router()

router.post('/create-user', AuthMiddleware.validateEmailandPassword, 
    AuthMiddleware.validateRequestParams,AuthController.createUserWithEmailandPassword )


export default router;