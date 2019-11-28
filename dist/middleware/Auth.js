'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth = function () {
    function Auth() {
        _classCallCheck(this, Auth);
    }

    _createClass(Auth, [{
        key: 'validateEmailandPassword',
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
        key: 'validateRequestParams',
        value: function validateRequestParams(req, res, next) {
            var _req$body2 = req.body,
                firstname = _req$body2.firstname,
                lastname = _req$body2.lastname,
                jobRole = _req$body2.jobRole,
                department = _req$body2.department,
                address = _req$body2.address;

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
    }]);

    return Auth;
}();

exports.default = new Auth();