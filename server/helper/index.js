import pool from "../Database";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

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

    } else {
        return '';
    }
}
export const validateKey = (obj, keys) => {
    if (typeof obj === "undefined" && typeof obj.length === "undefined") {
        return false;
    } else {
        let objetctKey = Object.keys(obj);
        let keyMatch;
        for (let i = 0; i < keys.length; i++) {
            keyMatch = false;
            for (let j = 0; j < objetctKey.length; j++) {
                if (keys[i] === objetctKey[j]) {
                    keyMatch = true;

                }
            }
            if (!keyMatch) {
                return false;
            }
        }
        if (keyMatch) {
            return true
        }
        return false;


    }
}

export const validateInput = (res, obj) => {
    if (typeof obj !== "undefined" && obj !== '' && typeof obj ===
        'object' && typeof obj.length === "undefined") {

        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === 'firstname' || keys[i] === 'lastname') {
                if (typeof obj[keys[i]] === undefined || obj[keys[i]] === '' ||
                    /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(obj[keys[i]])) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: `${keys[i]}  required and no special character allowed` });
                    return false;
                }

            }
            if (keys[i] === 'phonenumber') {
                if (typeof obj[keys[i]] === "undefined" || obj[keys[i]] === '' || !Validator.isNumeric(obj[keys[i]]) || obj[keys[i]].length < 11) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: `${keys[i]}  required and must be numbers of 11 digits` });
                    return false;
                }
            }
            if (keys[i] === 'email') {

                if (!Validator.isEmail(obj[keys[i]])) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: `${keys[i]}  required and must be in valid format` });
                    return false;
                }
            }
            else if (typeof obj[keys[i]] === "undefined" || obj[keys[i]] === '') {
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({ message: `${keys[i]} required` });
                return false;
            }
        }
        return true;

    } else {
        return false;
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
            if (typeof params !== "undefined" && params.length > 0) {
                client.query(sql, params, (err, result) => {
                    client.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result)

                    }
                })

            } else {
                client.query(sql, (err, result) => {
                    client.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                })
            }
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

export const sendMail = (useremail, message) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: useremail,
            subject: process.env.EMAIL_SUBJECT,
            html: `<h3><strong>${message}</strong></h3>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }

        })
    })
}
