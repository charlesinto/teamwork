"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createUserWithEmailandPassword = undefined;

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

        var sql = "select * from users where email = $1;";
        var result = await (0, _helper.executeQuery)(sql, [email]);
        if (result.rowCount > 0) {
            return (0, _helper.displayMessage)(res, 406, 'User email already exist');
        }
        var hashpassword = _bcrypt2.default.hashSync(password, 10);
        result = await (0, _helper.executeQuery)((0, _Auth.createUser)(), [firstname, lastname, email, gender, department, jobRole, address, hashpassword]);
        result = await (0, _helper.executeQuery)(sql, [email]);
        var token = await (0, _helper.assignToken)({ id: result.rows[0].id, email: result.rows[0].email,
            firstname: result.rows[0].firstname, lastname: result.rows[0].lastname, jobRole: result.rows[0].jobRole,
            department: result.rows[0].department });
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