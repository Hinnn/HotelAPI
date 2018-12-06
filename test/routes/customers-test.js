import datastore from '../../models/customers';

//let datastore = require('../../models/customers');
//let chai = require('chai');
//let chaiHttp = require('chai-http');
//let server = require('../../bin/www');
//let expect = chai.expect;
let mongoose = require('mongoose');
import chai from 'chai';
import chaiHttp from 'chai-http' ;
import server from '../../bin/www';
let expect = chai.expect;
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);
let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

//chai.use(chaiHttp);
//chai.use(require('chai-things'));
//let _ = require('lodash');
let customer =[
    {     'customerID': 1000202,
        'name': 'Yvette',
        'email': 'Yvette@wit.ie',
        'password': '21323'
    },

    {
        'customerID': 10000323,
        'name': 'Shaw',
        'email': 'shaw@gmail.com',
        'password': 'shaw123'
    },
    {
        'customerID': 10009340,
        'name': 'Yue',
        'email': 'yue@gmail.com',
        'password': 'yue123'
    }
];

let db = mongoose.connection;

describe('Customers', () => {
    before(function (done) {

        mongoose.connect(mongodbUri, {useNewUrlParser: true}, function (err) {
            if (err)
                console.log('Connection Error:' + err);
            else
                console.log(' ');
        });
        try {
            db.collection('customersdb').insertMany(customer);
        } catch (e) {
            //print(e);
            console.log(e);
        }
        done();

    });
    after(function (done) {

        db.collection('customersdb').remove({'customerID': {$in: [1000202, 10000323, 10009340,21000000]}});
        done();
    });

    describe('POST /customers', function () {
        it('should return confirmation message and add a customer', function (done) {
            let customer = {
                'customerID': 21000000,
                'name': 'Angle',
                'email': 'angle@163.com',
                'password': 'angle123'
            };
            chai.request(server)
                .post('/customers')
                .send(customer)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Sign up Successfully!');
                    done();

                });
        });
        after(function (done) {
            chai.request(server)
                .get('/customers')
                .end(function (err, res) {
                    let result = _.map(res.body, (customer) => {
                        return {
                            customerID: customer.customerID,
                            name: customer.name,
                            email: customer.email,
                            password: customer.password
                        };
                    });
                    expect(result).to.include({
                        'customerID': 21000000,
                        'name': 'Angle',
                        'email': 'angle@163.com',
                        'password': 'angle123'
                    });
                    done();
                });
        });
    });

    describe('POST /customers/:email',()=> {
        describe('Log in successfully!', function () {
            it('should return a message for customer sign in successfully', function (done) {
                let customer = {
                    'customerID': 1000202,
                    'name': 'Yvette',
                    'email': 'Yvette@wit.ie',
                    'password': '21323'
                };
                chai.request(server)
                    .post('/customers/Yvette@wit.ie')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Log in successfully!!');
                        done();

                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/customers')
                    .end(function (err, res) {
                        let result = _.map(res.body, (customer) => {
                            return {
                                customerID: customer.customerID,
                                name: customer.name,
                                email: customer.email,
                                password: customer.password
                            };
                        });
                        expect(result).to.include({
                            'customerID': 1000202,
                            'name': 'Yvette',
                            'email': 'Yvette@wit.ie',
                            'password': '21323'
                        });
                        done();
                    });
            });
        });
        describe('Username Not Found!', function () {
            it('should return a message for Username Not Found!', function (done) {
                let customer = {
                    'customerID': 1000202,
                    'name': 'Yvette',
                    'email': 'Yvette@wit.ie',
                    'password': '21323'
                };
                chai.request(server)
                    .post('/customers/Yvee@wit.ie')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Username Not Found!');
                        done();

                    });
            });
        });
        describe('Wrong password!', function () {
            it('should return a message for Wrong password!', function (done) {
                let customer = {
                    'customerID': 1000202,
                    'name': 'Yvette',
                    'email': 'Yvette@wit.ie',
                    'password': '213'
                };
                chai.request(server)
                    .post('/customers/Yvette@wit.ie')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Wrong password!');
                        done();

                    });
            });
        });
    });

    describe('GET /customers', () => {
        it('should return all the customers in an array', function (done) {
            chai.request(server)
                .get('/customers')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    let result = _.map(res.body, (customer) => {
                        return {
                            customerID: customer.customerID,
                            name: customer.name,
                            email: customer.email,
                            password: customer.password
                        };
                    });
                    expect(result).to.include({
                        'customerID': 1000202,
                        'name': 'Yvette',
                        'email': 'Yvette@wit.ie',
                        'password': '21323'
                    });

                    done();
                });
        });
    });



    describe('GET /customers/:customerID', () => {
        it('should return a customer with the specific customerID', function (done) {
            chai.request(server)
                .get('/customers/1000202')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (customer) => {
                        return {
                            customerID: customer.customerID,
                            name: customer.name,
                            email: customer.email,
                            password: customer.password
                        };
                    });
                    expect(result).to.include({
                        'customerID': 1000202,
                        'name': 'Yvette',
                        'email': 'Yvette@wit.ie',
                        'password': '21323'
                    });
                    done();

                });

        });
    });


    describe('DELETE /customers/customerID', function () {
        describe('Customer Successfully Deleted!', function () {
            it('should return confirmation message and delete a customer', function (done) {
                chai.request(server)
                    .delete('/customers/1000202')
                    //.end(function (err, res) {
                    .end(function () {
                        done();

                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/customers')
                    .end(function (err, res) {
                        let result = _.map(res.body, (customer) => {
                            return {
                                customerID: customer.customerID,
                                name: customer.name,
                                email: customer.email,
                                password: customer.password
                            };
                        });
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        expect(result).to.include({
                            'customerID': 10000323,
                            'name': 'Shaw',
                            'email': 'shaw@gmail.com',
                            'password': 'shaw123'

                        });
                        done();
                    });
            });
        });


        describe('Customer Not Deleted!!', function () {
            it('should return a message for customer not deleted', function (done) {
                chai.request(server)
                    .delete('/customer/10002')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        done();

                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/customers')
                    .end(function (err, res) {
                        let result = _.map(res.body, (customer) => {
                            return {
                                customerID: customer.customerID,
                                name: customer.name,
                                email: customer.email,
                                password: customer.password
                            };
                        });
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(4);
                        expect(result).to.include({
                            'customerID': 1000202,
                            'name': 'Yvette',
                            'email': 'Yvette@wit.ie',
                            'password': '21323'
                        });

                    });
                done();
            });//end after
        });//end describe
    });
});
//    });

//});

