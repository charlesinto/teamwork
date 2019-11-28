import { trimWhiteSpace, executeQuery, displayMessage, assignToken } from "../helper";
import Bcrypt from "bcrypt";
import { createUser } from "../scripts/Auth";

export const createUserWithEmailandPassword = async (req,res) => {
    try{
        const request = trimWhiteSpace(req.body);
        let {firstname , lastname,email,gender, department, jobRole,address,password} = request;
        let sql = `select * from users where email = $1;`;
        let result = await executeQuery(sql,[email])
        if(result.rowCount > 0){
            return displayMessage(res, 406, 'User email already exist')
        }
        const hashpassword = Bcrypt.hashSync(password,10);
        result = await executeQuery(createUser(),
             [firstname, lastname, email, gender, department, jobRole, address, hashpassword])
        result = await executeQuery(sql, [email])
        const token = await assignToken({id:result.rows[0].id, email:result.rows[0].email, 
                firstname: result.rows[0].firstname, lastname: result.rows[0].lastname, jobRole:result.rows[0].jobRole, 
                    department: result.rows[0].department})
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


