  
import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http';
// import fs from 'fs';
// import path from 'path';
// import bcrypt from 'bcrypt';
import {executeQuery} from '../helper';
import {newUser, userNoEmail} from '../model';
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('It should test all the end points', () => {
    before(function(done){
        let sql = `CREATE TABLE IF NOT EXISTS users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,
        gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),
        datecreated timestamp,updatedAt timestamp);`
        executeQuery(sql,[]).then(() => {
            done()
        })
    })
    after( (done) => {
        let sql = `DROP TABLE IF EXISTS users;`
        executeQuery(sql,[]).then(() => {
            done()
        })
    })
    describe('it should create a new user',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/create-user').type('form').send(newUser).end((err,res) => {
                if(err)
                    return console.log(err)
                expect(res).to.be.an('object');
                expect(res).to.have.status(201);
                expect(res.body.message).to.have.property('data');
                expect(res.body.message).to.have.property('status');
                expect(res.body.message.data).to.have.property('token');
                done();
            })
        })
        it('it should fail for creating the same user', (done) => {
            chai.request(app).post('/api/v1/auth/create-user').type('form').send(newUser).end((err,res) => {
                if(err)
                    return console.log(err)
                expect(res).to.be.an('object');
                expect(res).to.have.status(406);
                expect(res.body).to.have.property('message');
                done()
            })
        })

        
    })
    describe('it should fail for creating user without email',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/create-user').type('form').send(userNoEmail).end((err,res) => {
                if(err)
                    return console.log(err)
                expect(res).to.be.an('object');
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done()
            })
        })
    })

})