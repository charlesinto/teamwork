import pool from "../Database";
import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';

/*
*@ helper functions
* @trimeWhiteSpace given an object, it removes the whitespaces in the values of the object
* @validateKey give an object and array of key you expect the object to have, it validates 
* if the obejct contains the key
*@validateInput ensure that the inputs are valid 
*/

export const trimWhiteSpace = (obj) => {
    if (typeof obj !== "undefined" && obj !== '' && typeof obj === 'object' &&
        typeof obj.length === "undefined") {

        Object.keys(obj).forEach(function (key) {
            if (obj[key] !== null && typeof obj[key] !== "number" && !Array.isArray(obj[key])) {
                obj[key] = obj[key].trim()
            }
        });
        return obj;

    }
}



/**
* Initiates connection a database.
* @author: charles
*/
const connectToDb = () => {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(client, done);
            }
        })
    })
}
/**
 * Executes a query againt postgress database
 *
 *
 * @author: charles
 * @param {sql, params} r takes in the sql statement and the parameters to be passed in.
 */
export const executeQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        connectToDb().then((client, done) => {
            client.query(sql, params, (err, result) => {
                client.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(result)

                }
            })
            
        })
            .catch((err) => {
                reject(err);
            })
    })

}
/**
* Assign token to user
*
* 
* @author: chalres
* @param {payload}  The user details.
*/
export const assignToken = (payload) => {
    let key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    return new Promise((resolve, reject) => {
        jwt.sign(payload, key, { expiresIn: '7 days' }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })

    })
}
export const displayMessage = (res, statusCode, message, details) => {
    if (typeof details !== 'undefined') {
        res.statusCode = statusCode;
        res.setHeader('content-type', 'application/json');
        console.log('err', details)
        return res.json({ message, details });
    }
    res.statusCode = statusCode;
    res.setHeader('content-type', 'application/json');
    return res.json({ message });
}

// export const sendMail = (useremail, message) => {
//     return new Promise((resolve, reject) => {
//         const transporter = nodemailer.createTransport({
//             service: process.env.EMAIL_SERVICE,
//             auth: {
//                 user: process.env.SENDER_EMAIL,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: useremail,
//             subject: process.env.EMAIL_SUBJECT,
//             html: `<h3><strong>${message}</strong></h3>`
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 reject(error)
//             } else {
//                 resolve(info)
//             }

//         })
//     })
// }
