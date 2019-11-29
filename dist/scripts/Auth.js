"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createUser = exports.createUser = function createUser() {
    return "insert into users(firstname, lastname, email, gender,department, jobRole, address,role, password, datecreated)\n            values($1, $2,$3,$4,$5,$6,$7, $8,$9, 'NOW()');";
};

var signInUser = exports.signInUser = function signInUser() {
    return "SELECT * FROM USERS WHERE email = $1";
};