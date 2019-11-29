"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth = function () {
    function Auth() {
        _classCallCheck(this, Auth);
    }

    _createClass(Auth, [{
        key: "validateEmailandPassword",
        value: function validateEmailandPassword(req, res, next) {
            var _req$body = req.body,
                email = _req$body.email,
                password = _req$body.password;

            console.log(email, password);
            if (email) {
                console.log(email);
                if (!_validator2.default.isEmail(email)) {
                    return res.status(400).send({
                        message: 'Email is not valid'
                    });
                }
            } else {
                console.log(email);
                return res.status(400).send({
                    message: 'Email is not valid'
                });
            }
            if (typeof password === 'undefined' || password.trim() === '') {
                return res.status(400).send({
                    message: 'Password is required'
                });
            }
            next();
        }
    }, {
        key: "validateUsernameAndPassword",
        value: function validateUsernameAndPassword(req, res, next) {
            var _req$body2 = req.body,
                username = _req$body2.username,
                password = _req$body2.password;

            console.log(username, password);
            if (!username || username.trim() === '') {

                return res.status(400).send({
                    message: 'username and password is required'
                });
            }
            if (!password || password.trim() === '') {
                return res.status(400).send({
                    message: 'username and password is required'
                });
            }
            return next();
        }
    }, {
        key: "validateRequestParams",
        value: function validateRequestParams(req, res, next) {
            var _req$body3 = req.body,
                firstname = _req$body3.firstname,
                lastname = _req$body3.lastname,
                jobRole = _req$body3.jobRole,
                department = _req$body3.department,
                address = _req$body3.address;

            if (!firstname || firstname.trim() === '') {
                return res.status(400).send({
                    message: 'First Name is required'
                });
            }
            if (!lastname || lastname.trim() === '') {
                return res.status(400).send({
                    message: 'Last Name is required'
                });
            }
            if (!jobRole || jobRole.trim() === '') {
                return res.status(400).send({
                    message: 'Job Role is required'
                });
            }
            if (!department || department.trim() === '') {
                return res.status(400).send({
                    message: 'Department is required'
                });
            }
            if (!address || address.trim() === '') {
                return res.status(400).send({
                    message: 'Address is required'
                });
            }
            next();
        }
    }, {
        key: "validateToken",
        value: function validateToken(req, res, next) {
            var key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
            var bearerHeader = req.body.token || req.headers['token'];
            if (!bearerHeader) {
                return res.status(401).send({
                    message: 'Unauthorized user'
                });
            } else if ((typeof bearerHeader === "undefined" ? "undefined" : _typeof(bearerHeader)) !== undefined) {
                _jsonwebtoken2.default.verify(bearerHeader, key, function (err, authData) {
                    if (err) {
                        return res.status(403).send({
                            message: "Forbidden access"
                        });
                    }
                    req.user = authData;
                    next();
                });
            }
        }
    }, {
        key: "validateIsAdmin",
        value: function validateIsAdmin(req, res, next) {
            if (req.user.role === 'admin') {
                return next();
            }
            return res.status(403).send({
                message: "Forbidden access"
            });
        }
    }]);

    return Auth;
}();

exports.default = new Auth();