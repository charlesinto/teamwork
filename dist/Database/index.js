"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pg = require("pg");

var _pg2 = _interopRequireDefault(_pg);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = void 0;
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    pool = new _pg2.default.Pool({
        connectionString: process.env.DEV_DATABASE,
        ssl: true
    });
} else if (process.env.NODE_ENV === 'TEST') {
    pool = new _pg2.default.Pool({
        connectionString: process.env.TEST_DATABASE,
        ssl: true
    });
} else if (process.env.NODE_ENV === 'PRODUCTION') {
    pool = new _pg2.default.Pool({
        connectionString: process.env.PROD_DATABASE, ssl: true
    });
}

exports.default = pool;