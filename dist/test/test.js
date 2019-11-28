'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _helper = require('../helper');

var _model = require('../model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import fs from 'fs';
// import path from 'path';
// import bcrypt from 'bcrypt';
var should = _chai2.default.should();
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

describe('It should test all the end points', function () {
    before(function (done) {
        var sql = 'CREATE TABLE IF NOT EXISTS users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,\n        gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),\n        datecreated timestamp,updatedAt timestamp);';
        (0, _helper.executeQuery)(sql, []).then(function () {
            done();
        }).catch(function (err) {
            console.log('err', err);
            done();
        });
    });
    after(function (done) {
        var sql = 'DROP TABLE IF EXISTS users;';
        (0, _helper.executeQuery)(sql, []).then(function () {
            done();
        }).catch(function (err) {
            console.log('err', err);
            done();
        });
    });
    describe('it should create a new user', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').send(_model.newUser).end(function (err, res) {
                if (err) return console.log(err);
                expect(res).to.be.an('object');
                expect(res).to.have.status(201);
                expect(res.body.message).to.have.property('data');
                expect(res.body.message).to.have.property('status');
                expect(res.body.message.data).to.have.property('token');
                done();
            });
        });
        it('it should fail for creating the same user', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').send(_model.newUser).end(function (err, res) {
                if (err) return console.log(err);
                expect(res).to.be.an('object');
                expect(res).to.have.status(406);
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });
    describe('it should fail for creating user without email', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').send(_model.userNoEmail).end(function (err, res) {
                if (err) return console.log(err);
                expect(res).to.be.an('object');
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });
});