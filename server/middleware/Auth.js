import Validator from "validator";
import jwt from "jsonwebtoken";

class Auth{
    validateEmailandPassword(req, res, next){
        const {body: {email, password}} = req
        console.log(email, password)
        if(email){
            console.log(email)
            if(!Validator.isEmail(email)){
                return res.status(400).send({
                    message:'Email is not valid'
                })
            }
            
        }else{
            console.log(email)
            return res.status(400).send({
                message:'Email is not valid'
            })
        }
        if(typeof password === 'undefined' || password.trim() === ''){
            return res.status(400).send({
                message: 'Password is required'
            })
        }
        next()
    }
    validateRequestParams(req, res, next){
        const {body: {firstname, lastname, jobRole, department, address}} = req
        if(!firstname || firstname.trim() === ''){
            return res.status(400).send({
                message:'First Name is required'
            })
        }
        if(!lastname || lastname.trim() === ''){
            return res.status(400).send({
                message:'Last Name is required'
            })
        }
        if(!jobRole || jobRole.trim() === ''){
            return res.status(400).send({
                message:'Job Role is required'
            })
        }
        if(!department || department.trim() === ''){
            return res.status(400).send({
                message:'Department is required'
            })
        }
        if(!address || address.trim() === ''){
            return res.status(400).send({
                message:'Address is required'
            })
        }
        next()
    }
    validateToken(req, res, next){
        let key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
        const bearerHeader = req.body.token || req.headers['token'];
        if (!bearerHeader){
            return res.status(401).send({
                message: 'Unauthorized user'
            });
        } else if(typeof bearerHeader !== undefined){
            jwt.verify(bearerHeader, key,(err, authData) => {
                if(err) {
                    return res.status(403).send({
                        message: "Forbidden access"
                    });
                }
              req.user = authData;
              next();
            })
            
        }
    }
}

export default new Auth();