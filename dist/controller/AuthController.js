"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.signInWithUsernameandPassword = exports.createUserWithEmailandPassword = undefined;

var _helper = require("../helper");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _Auth = require("../scripts/Auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUserWithEmailandPassword = exports.createUserWithEmailandPassword = async function createUserWithEmailandPassword(req, res) {
    try {
        var request = (0, _helper.trimWhiteSpace)(req.body);
        var firstname = request.firstname,
            lastname = request.lastname,
            email = request.email,
            gender = request.gender,
            department = request.department,
            jobRole = request.jobRole,
            address = request.address,
            password = request.password;

        var role = request.role || 'employee';
        var sql = "select * from users where email = $1;";
        var result = await (0, _helper.executeQuery)(sql, [email]);
        if (result.rowCount > 0) {
            return (0, _helper.displayMessage)(res, 406, 'User email already exist');
        }
        var hashpassword = _bcrypt2.default.hashSync(password, 10);
        result = await (0, _helper.executeQuery)((0, _Auth.createUser)(), [firstname, lastname, email, gender, department, jobRole, address, role, hashpassword]);
        result = await (0, _helper.executeQuery)(sql, [email]);
        var token = await (0, _helper.assignToken)({ id: result.rows[0].id, email: result.rows[0].email,
            firstname: result.rows[0].firstname, lastname: result.rows[0].lastname, jobRole: result.rows[0].jobRole,
            department: result.rows[0].department, role: result.rows[0].role });
        return (0, _helper.displayMessage)(res, 201, { status: "success", data: {
                message: 'User account created successfully',
                token: token,
                "userId": result.rows[0].id,
                email: email
            } });
    } catch (err) {
        console.log('some errors encountered', err);
        return (0, _helper.displayMessage)(res, 500, err);
    }
};

var signInWithUsernameandPassword = exports.signInWithUsernameandPassword = async function signInWithUsernameandPassword(req, res) {
    try {
        var request = (0, _helper.trimWhiteSpace)(req.body);
        var username = request.username,
            password = request.password;

        var result = await (0, _helper.executeQuery)((0, _Auth.signInUser)(), [username]);
        if (result.rowCount > 0) {
            if (!_bcrypt2.default.compareSync(password, result.rows[0].password)) {
                return (0, _helper.displayMessage)(res, 404, {
                    message: 'Wrong email or password'
                });
            }
            var token = await (0, _helper.assignToken)({
                id: result.rows[0].id, email: result.rows[0].email,
                firstname: result.rows[0].firstname, lastname: result.rows[0].lastname,
                jobRole: result.rows[0].jobRole,
                department: result.rows[0].department,
                role: result.rows[0].role
            });
            return (0, _helper.displayMessage)(res, 200, {
                status: "success", data: {
                    message: 'Login successful',
                    token: token,
                    "userId": result.rows[0].id,
                    email: username
                }
            });
        }
        return (0, _helper.displayMessage)(res, 404, {
            message: 'Wrong email or password'
        });
    } catch (err) {
        console.log('some errors encountered', err);
        return (0, _helper.displayMessage)(res, 500, err);
    }
};