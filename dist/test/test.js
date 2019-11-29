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
        var sql = 'CREATE TABLE IF NOT EXISTS users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,\n        gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),role VARCHAR(50),\n        datecreated timestamp,updatedAt timestamp);\n        CREATE TABLE IF NOT EXISTS article(id serial primary key,title varchar(255) not null,article varchar(255) not null,userid INTEGER not null,\n        datecreated timestamp,updatedAt timestamp);\n        CREATE TABLE IF NOT EXISTS comments(id serial primary key,comment varchar(255) not null,articleId varchar(255) not null,\n        userid INTEGER not null,\n        datecreated timestamp,updatedAt timestamp);\n        insert into users(firstname, lastname, email, password, gender,jobrole, department, address, role, datecreated)\n        VALUES (\n            \'charles\', \'chibuike\', \'admin@ex.com\', \'$2b$10$q0aG/D1/wTrF3q.WYQrrce.SSWOASpOz3i22vdV/O5H5qOnIyv71K\', \'male\', \'writer\' ,\'logistics\' ,\'123cvb \',\'admin\', \'2019-11-29 07:30:58.600097\'\n        );\n        insert into article(title, article, userid, datecreated)\n        VALUES(\'o\', \'i\', 1, \'NOW()\'),\n        (\'o\', \'i\', 1, \'NOW()\'),\n        (\'o\', \'i\', 1, \'NOW()\');\n        ';
        (0, _helper.executeQuery)(sql, []).then(function () {
            done();
        }).catch(function (err) {
            console.log('err', err);
            done();
        });
    });
    after(function (done) {
        var sql = 'DROP TABLE IF EXISTS users;DROP TABLE IF EXISTS article;DROP TABLE IF EXISTS comments;';
        (0, _helper.executeQuery)(sql, []).then(function () {
            done();
        }).catch(function (err) {
            console.log('err', err);
            done();
        });
    });
    describe('it should create a new user', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                console.log('response', res);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').set('token', token).send(_model.newUser).end(function (err, res) {

                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('it should fail for creating the same user', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').set('token', token).send(_model.newUser).end(function (err, res) {

                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('employee should not be able to create', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').set('token', token).send(_model.user2).end(function (err, res) {

                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });
    describe('it should fail for creating user without email', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/auth/create-user').type('form').set('token', token).send(_model.userNoEmail).end(function (err, res) {

                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });
    describe('it should login a user', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {

                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                // expect(res.body).to.have.property('status');
                done();
            });
        });
    });
    describe('it should not login a user with incorrect password', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.userWithWrongPassword).end(function (err, res) {

                expect(res).to.be.an('object');
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });
    describe('it should not login a user with no email', function () {

        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send({ password: '1234' }).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });

    describe('it should test article endpoint', function () {

        it('it should create new article ', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article').type('form').set('token', token).send(_model.newArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('it should return unauthourized user when no token is present', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                _chai2.default.request(_index2.default).post('/api/v1/article').type('form').send(_model.newArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('it should return forbidden user when token is invalid', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = 'hsiusniusisiusiusiunius';
                _chai2.default.request(_index2.default).post('/api/v1/article').type('form').set('token', token).send(_model.newArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('it should not create article when there is no title params ', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article').type('form').set('token', token).send({}).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
        it('it should not create article when there is no article params', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article').type('form').set('token', token).send({ title: 'hshssu' }).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });

        it('it should get an article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).get('/api/v1/article/1').set('token', token).send({ title: 'hshssu' }).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    done();
                });
            });
        });
        it('it should return for not found article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).get('/api/v1/article/10000').set('token', token).send({ title: 'hshssu' }).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(404);
                    done();
                });
            });
        });
        it('it should get all article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.newUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).get('/api/v1/feed').set('token', token).send({ title: 'hshssu' }).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    done();
                });
            });
        });

        /* UPDATE */

        it('it should update article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).patch('/api/v1/article/1').type('form').set('token', token).send(_model.completeArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
        it('it should update article with title only', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).patch('/api/v1/article/1').type('form').set('token', token).send(_model.onlyTitle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });

        it('it should update article with article only', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).patch('/api/v1/article/1').type('form').set('token', token).send(_model.onlyArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
        it('it should not update article without title and article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).patch('/api/v1/article/1').type('form').set('token', token).send(_model.wrongArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
        it('it should return not found for non existing article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).patch('/api/v1/article/100000').type('form').set('token', token).send(_model.wrongArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });

        /* DELETE ARTICLE */
        it('it should return not found for non existing article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).delete('/api/v1/article/100000').set('token', token).send(_model.wrongArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });

        it('it should delete article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).delete('/api/v1/article/2').set('token', token).send(_model.wrongArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
    });

    describe('it should test comment endpoint', function () {
        it('it should comment on article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article/1').set('token', token).send(_model.comment).send(_model.wrongArticle).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
        it('it should return 404 for not found article', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article/10000').set('token', token).send(_model.comment).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(400);
                    expect(res.body.data).to.have.property('message');
                    done();
                });
            });
        });
        it('it should return 400 when no comment is provided', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signin').type('form').send(_model.adminUser).end(function (err, res) {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                var token = res.body.message.data.token;
                _chai2.default.request(_index2.default).post('/api/v1/article/1').set('token', token).send({}).send({}).end(function (err, res) {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message');
                    done();
                });
            });
        });
    });
});