  
import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http';
import {executeQuery} from '../helper';
import {newUser, userNoEmail, userWithWrongPassword, newArticle, user2, adminUser, completeArticle, onlyTitle, onlyArticle, wrongArticle, comment} from '../model';
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('It should test all the end points', () => {
    before(function(done){
        let sql = `CREATE TABLE IF NOT EXISTS users(id serial primary key,firstname varchar(255) not null,lastname varchar(255) not null,email varchar(255) not null,password varchar(255) not null,
        gender varchar(50),jobrole varchar(50),department varchar(50),address varchar(150),role VARCHAR(50),
        datecreated timestamp,updatedAt timestamp);
        CREATE TABLE IF NOT EXISTS article(id serial primary key,title varchar(255) not null,article varchar(255) not null,userid INTEGER not null,
        datecreated timestamp,updatedAt timestamp);
        CREATE TABLE IF NOT EXISTS comments(id serial primary key,comment varchar(255) not null,articleId varchar(255) not null,
        userid INTEGER not null,
        datecreated timestamp,updatedAt timestamp);
        insert into users(firstname, lastname, email, password, gender,jobrole, department, address, role, datecreated)
        VALUES (
            'charles', 'chibuike', 'admin@ex.com', '$2b$10$q0aG/D1/wTrF3q.WYQrrce.SSWOASpOz3i22vdV/O5H5qOnIyv71K', 'male', 'writer' ,'logistics' ,'123cvb ','admin', '2019-11-29 07:30:58.600097'
        );
        insert into article(title, article, userid, datecreated)
        VALUES('o', 'i', 1, 'NOW()');
        `
        executeQuery(sql,[]).then(() => {
            done()
        }).catch((err) => {
            console.log('err', err)
            done()
        })
    })
    after( function (done){
        let sql = `DROP TABLE IF EXISTS users;DROP TABLE IF EXISTS article;DROP TABLE IF EXISTS comments;`
        executeQuery(sql,[]).then(() => {
            done()
        }).catch((err) => {
            console.log('err', err)
            done()
        })
    })
    describe('it should create a new user',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) =>{
               
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/auth/create-user').type('form').set('token', token)
                    .send(newUser).end((err,res) => {
        
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message');
                    done()
                })
            })
        })
        it('it should fail for creating the same user', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) =>{
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/auth/create-user').type('form').set('token', token)
                    .send(newUser).end((err,res) => {
        
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(406);
                    expect(res.body).to.have.property('message');
                    done()
                })
            })
        })
        it('employee should not be able to create', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err, res) =>{
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/auth/create-user').type('form').set('token', token)
                    .send(user2).end((err,res) => {
        
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('message');
                    done()
                })
            })
            
        })
        
    })
    describe('it should fail for creating user without email',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) =>{
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/auth/create-user').type('form').set('token', token)
                    .send(userNoEmail).end((err,res) => {
        
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message');
                    done()
                })
            })
        })
    })
    describe('it should login a user',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                // expect(res.body).to.have.property('status');
                done()
            })
        })
    })
    describe('it should not login a user with incorrect password',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(userWithWrongPassword).end((err,res) => {
                
                expect(res).to.be.an('object');
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message');
                done()
            })
        })
    })
    describe('it should not login a user with no username',() => {
        
        it('response should be an object', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send({password:'1234'}).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done()
            })
        })

    })

    describe('it should test article endpoint',() => {
        
        it('it should create new article ', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article').type('form').set('token', token)
                    .send(newArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(201);
                        expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should return unauthourized user when no token is present', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                chai.request(app).post('/api/v1/article').type('form')
                    .send(newArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(401);
                        expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should return forbidden user when token is invalid', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = 'hsiusniusisiusiusiunius'
                chai.request(app).post('/api/v1/article').type('form').set('token', token)
                    .send(newArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(403);
                        expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should not create article when there is no title params ', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article').type('form').set('token', token)
                    .send({}).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should not create article when there is no article params', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article').type('form').set('token', token)
                    .send({title:'hshssu'}).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })

        it('it should get an article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                // console.log('get an article', res)
                const token = res.body.message.data.token
                chai.request(app).get('/api/v1/article/1').set('token', token).end((err, res) => {
                        expect(res).to.be.an('object');
                        // console.log('get an article', res)
                        expect(res).to.have.status(200);
                        done()
                    })
            })
        })
        it('it should return for not found article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).get('/api/v1/article/5').set('token', token).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                        done()
                    })
            })
        })
        it('it should get all article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(newUser).end((err,res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).get('/api/v1/feed').set('token', token)
                    .send({title:'hshssu'}).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(200);
                        done()
                    })
            })
        })

       /* UPDATE */

        it('it should update article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).patch('/api/v1/article/1').type('form').set('token', token)
                    .send(completeArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(201);
                       // expect(res.body.data).to.have.property('message');
                        done()
                    })
            })
        })
            it('it should update article with title only', (done) => {
                chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    const token = res.body.message.data.token
                    chai.request(app).patch('/api/v1/article/1').type('form').set('token', token)
                        .send(onlyTitle).end((err, res) => {
                            expect(res).to.be.an('object');
                            expect(res).to.have.status(201);
                           // expect(res.body.data).to.have.property('message');
                            done()
                        })
                })
            })

            it('it should update article with article only', (done) => {
                chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                    expect(res).to.be.an('object');
                    expect(res).to.have.status(200);
                    const token = res.body.message.data.token
                    chai.request(app).patch('/api/v1/article/1').type('form').set('token', token)
                        .send(onlyArticle).end((err, res) => {
                            expect(res).to.be.an('object');
                            expect(res).to.have.status(201);
                           // expect(res.body.data).to.have.property('message');
                            done()
                        })
                })
            })
                it('it should not update article without title and article', (done) => {
                    chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(200);
                        const token = res.body.message.data.token
                        chai.request(app).patch('/api/v1/article/1').type('form').set('token', token)
                            .send(wrongArticle).end((err, res) => {
                                expect(res).to.be.an('object');
                                expect(res).to.have.status(400);
                               // expect(res.body.data).to.have.property('message');
                                done()
                            })
                    })

                })
                it('it should return not found for non existing article', (done) => {
                    chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(200);
                        const token = res.body.message.data.token
                        chai.request(app).patch('/api/v1/article/50').type('form').set('token', token)
                            .send(wrongArticle).end((err, res) => {
                                expect(res).to.be.an('object');
                                expect(res).to.have.status(400);
                               // expect(res.body.data).to.have.property('message');
                                done()
                            })
                    })

                })

        /* DELETE ARTICLE */
        it('it should return not found for non existing article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).delete('/api/v1/article/5').set('token', token)
                    .send(wrongArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                       // expect(res.body.data).to.have.property('message');
                        done()
                    })
            })
        })

        it('it should delete article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).delete('/api/v1/article/2').set('token', token)
                    .send(wrongArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                       // expect(res.body.data).to.have.property('message');
                        done()
                    })
            })
        })
    })

    describe('it should test comment endpoint',() => {
        it('it should comment on article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article/1').set('token', token).send(comment)
                    .send(wrongArticle).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                       // expect(res.body.data).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should return 404 for not found article', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article/5').set('token', token)
                    .send(comment).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                       // expect(res.body.data).to.have.property('message');
                        done()
                    })
            })
        })
        it('it should return 400 when no comment is provided', (done) => {
            chai.request(app).post('/api/v1/auth/signin').type('form').send(adminUser).end((err, res) => {
                expect(res).to.be.an('object');
                expect(res).to.have.status(200);
                const token = res.body.message.data.token
                chai.request(app).post('/api/v1/article/1').set('token', token)
                    .send({}).end((err, res) => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.status(404);
                       // expect(res.body).to.have.property('message');
                        done()
                    })
            })
        })
    })

})