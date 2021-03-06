import { trimWhiteSpace, executeQuery, displayMessage, assignToken } from "../helper";
import Bcrypt from "bcrypt";
import { createUser,signInUser } from "../scripts/Auth";

export const createUserWithEmailandPassword = async (req,res) => {
    try{
        const request = trimWhiteSpace(req.body);
        let {firstname , lastname,email,gender, department, jobRole,address,password} = request;
        const role = request.role || 'employee';
        let sql = `select * from users where email = $1;`;
        let result = await executeQuery(sql,[email])
        if(result.rowCount > 0){
            return displayMessage(res, 406, 'User email already exist')
        }
        const hashpassword = Bcrypt.hashSync(password,10);
        result = await executeQuery(createUser(),
             [firstname, lastname, email, gender, department, jobRole, address,role, hashpassword])
        result = await executeQuery(sql, [email])
        const token = await assignToken({id:result.rows[0].id, email:result.rows[0].email, 
                firstname: result.rows[0].firstname, lastname: result.rows[0].lastname, jobRole:result.rows[0].jobRole, 
                    department: result.rows[0].department, role: result.rows[0].role})
        return displayMessage(res, 201, {status:"success", data:{
            message: 'User account created successfully',
            token,
            "userId": result.rows[0].id,
            email
        }})
    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
    

}

export const signInWithUsernameandPassword = async (req, res) => {
    try{
        const request = trimWhiteSpace(req.body)
        const {username, password} = request;
        const result = await executeQuery(signInUser(), [username])
        if(result.rowCount > 0){
            if(!Bcrypt.compareSync(password,result.rows[0].password)){
                return displayMessage(res, 404, {
                    message: 'Wrong email or password'
                })
            }
            const token = await assignToken({
                id: result.rows[0].id, email: result.rows[0].email,
                firstname: result.rows[0].firstname, lastname: result.rows[0].lastname, 
                jobRole: result.rows[0].jobRole,
                department: result.rows[0].department,
                role: result.rows[0].role
            })
            return displayMessage(res, 200, {
                status: "success", data: {
                    message: 'Login successful',
                    token,
                    "userId": result.rows[0].id,
                    email: username
                }
            })
        }
        return displayMessage(res, 404, {
            message: 'Wrong email or password'
        })
    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}


