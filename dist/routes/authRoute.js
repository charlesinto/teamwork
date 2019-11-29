"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Auth = require("../middleware/Auth");

var _Auth2 = _interopRequireDefault(_Auth);

var _AuthController = require("../controller/AuthController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/create-user', _Auth2.default.validateEmailandPassword, _Auth2.default.validateRequestParams, _Auth2.default.validateToken, _Auth2.default.validateIsAdmin, _AuthController.createUserWithEmailandPassword);

router.post('/signin', _Auth2.default.validateUsernameAndPassword, _AuthController.signInWithUsernameandPassword);

exports.default = router;