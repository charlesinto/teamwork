"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.displayMessage = exports.assignToken = exports.executeQuery = exports.trimWhiteSpace = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Database = require("../Database");

var _Database2 = _interopRequireDefault(_Database);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import nodemailer from 'nodemailer';

/*
*@ helper functions
* @trimeWhiteSpace given an object, it removes the whitespaces in the values of the object
* @validateKey give an object and array of key you expect the object to have, it validates 
* if the obejct contains the key
*@validateInput ensure that the inputs are valid 
*/

var trimWhiteSpace = exports.trimWhiteSpace = function trimWhiteSpace(obj) {
    if (typeof obj !== "undefined" && obj !== '' && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object' && typeof obj.length === "undefined") {

        Object.keys(obj).forEach(function (key) {
            if (obj[key] !== null && typeof obj[key] !== "number" && !Array.isArray(obj[key])) {
                obj[key] = obj[key].trim();
            }
        });
        return obj;
    }
};

/**
* Initiates connection a database.
* @author: charles
*/
var connectToDb = function connectToDb() {
    return new Promise(function (resolve, reject) {
        _Database2.default.connect(function (err, client, done) {
            if (err) {
                reject(err);
            } else {
                resolve(client, done);
            }
        });
    });
};
/**
 * Executes a query againt postgress database
 *
 *
 * @author: charles
 * @param {sql, params} r takes in the sql statement and the parameters to be passed in.
 */
var executeQuery = exports.executeQuery = function executeQuery(sql, params) {
    return new Promise(function (resolve, reject) {
        connectToDb().then(function (client, done) {
            client.query(sql, params, function (err, result) {
                client.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};
/**
* Assign token to user
*
* 
* @author: chalres
* @param {payload}  The user details.
*/
var assignToken = exports.assignToken = function assignToken(payload) {
    var key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.sign(payload, key, { expiresIn: '7 days' }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};
var displayMessage = exports.displayMessage = function displayMessage(res, statusCode, message, details) {
    if (typeof details !== 'undefined') {
        res.statusCode = statusCode;
        res.setHeader('content-type', 'application/json');
        console.log('err', details);
        return res.json({ message: message, details: details });
    }
    res.statusCode = statusCode;
    res.setHeader('content-type', 'application/json');
    return res.json({ message: message });
};

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