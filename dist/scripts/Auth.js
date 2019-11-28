"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createUser = exports.createUser = function createUser() {
    return "insert into users(firstname, lastname, email, gender,department, jobRole, address, password, datecreated)\n            values($1, $2,$3,$4,$5,$6,$7, $8, 'NOW()');";
};