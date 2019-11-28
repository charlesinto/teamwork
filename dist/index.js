'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _authRoute = require('./routes/authRoute');

var _authRoute2 = _interopRequireDefault(_authRoute);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
// import socket from 'socket.io';

app.use(_express2.default.static(_path2.default.join(__dirname, 'Client')));
app.use(_express2.default.static('Client'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use('/api/v1/auth', _authRoute2.default);

var port = process.env.PORT || 5000;
var server = _http2.default.createServer(app);
// let io = socket().listen(server);
// io.on('connection', (socket)=>{
//     console.log(`user connected, id: ${socket.id}`);

// })

server.listen(port, function () {
   console.log('server is listening on port ' + port);
});

exports.default = server;