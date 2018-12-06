// let datastore = require('../../models/bookings');
//let chai = require('chai');
//let chaiHttp = require('chai-http');
//let server = require('../../bin/www');
//let expect = chai.expect;
let mongoose = require('mongoose');

import chai from 'chai';
import chaiHttp from 'chai-http' ;
import server from '../../bin/www';
//var server = null ; // CHANGED
let expect = chai.expect;
import datastore from '../../models/bookings';
//var datastore = null ; // CHANGED
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);
let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

//chai.use(chaiHttp);
//chai.use(require('chai-things'));
//let _ = require('lodash');
let booking =[
    { 'customerID': 1000202,
        'paymenttype': 'Visa',
        'date': 20181029,
        'amount': 1,
        'roomNum': '102',
        'price': 30},

    {
        'customerID': 10000323,
        'paymenttype': 'Master',
        'date': 20181030,
        'amount': 1,
        'roomNum': '201',
        'price': 35 
    },
    {
        'customerID': 10009340,
        'paymenttype': 'Direct',
        'date': 20181203,
        'amount': 1,
        'roomNum': '303',
        'price': 30
    }
];

let db = mongoose.connection;

describe('Bookings', () => {
    before(function (done) {

        mongoose.connect(mongodbUri, {useNewUrlParser: true}, function (err) {
            if (err)
                console.log('Connection Error:' + err);
            else
                console.log('  ');
        });
        try {
            db.collection('bookingsdb').insertMany(booking);
            console.log('Booking insert successfully.');
        } catch (e) {
            //print(e);
            console.log(e);
        }
        done();

    });
    after(function (done) {
        //db.collection("bookingsdb").remove(booking);
        db.collection('bookingsdb').remove({'customerID': {$in: [1000202, 10000323, 10009340, 21000000]}});
        done();
        //server.close(done);
    });

    describe('GET /bookings', () => {
        it('should return all the bookings in an array', function (done) {

            chai.request(server)
                .get('/bookings')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (booking) => {
                        return {
                            customerID: booking.customerID,
                            paymenttype: booking.paymenttype,
                            date: booking.date,
                            amount: booking.amount,
                            roomNum: booking.roomNum,
                            price: booking.price
                        };
                    });
                    expect(result).to.include({
                        'customerID': 10000323,
                        'paymenttype': 'Master',
                        'date': 20181030,
                        'amount': 1,
                        'roomNum': '201',
                        'price': 35
                    });

                    done();
                });
        });
    });
    // });

    describe('GET /bookings/:customerID', () => {
        it('should return a booking with the specific customerID', function (done) {
            chai.request(server)
                .get('/bookings/10000323')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (bookings) => {
                        return {
                            customerID: bookings.customerID,
                            paymenttype: bookings.paymenttype,
                            date: bookings.date,
                            amount: bookings.amount,
                            roomNum: bookings.roomNum,
                            price: bookings.price
                        };
                    });
                    expect(result).to.include({
                        'customerID': 10000323,
                        'paymenttype': 'Master',
                        'date': 20181030,
                        'amount': 1,
                        'roomNum': '201',
                        'price': 35
                    });
                    done();

                });

        });
    });


    describe('POST /bookings/:customerID', function () {
        it('should return confirmation message and update datastore', function (done) {
            let booking = {
                'customerID': 21000000,
                'paymenttype': 'Direct',
                'date': 20181201,
                'amount': 1,
                'roomNum': '102',
                'price': 25
            };
            chai.request(server)
                .post('/bookings')
                .send(booking)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    //expect(res.body.length).to.equal(4);
                    expect(res.body).to.have.property('message').equal('Booking Successfully Added!');
                    done();

                });
        });
        after(function (done) {
            chai.request(server)
                .get('/bookings')
                .end(function (err, res) {
                    let result = _.map(res.body, (booking) => {
                        return {

                            customerID: booking.customerID,
                            paymenttype: booking.paymenttype,
                            date: booking.date,
                            amount: booking.amount,
                            roomNum: booking.roomNum,
                            price: booking.price
                        };
                    });
                    expect(result).to.include({

                        'customerID': 21000000,
                        'paymenttype': 'Direct',
                        'date': 20181201,
                        'amount': 1,
                        'roomNum': '102',
                        'price': 25
                    });
                    done();
                });
        });
    });

    describe('PUT/bookings/:customerID/amount',()=> {
        describe('Booking Edited Successfully', function () {
            it('should return a message and the booking detail is edited', function (done) {
                let booking = {
                    'customerID': 1000202,
                    'paymenttype': 'Visa',
                    'date': 20181029,
                    'amount': 1,
                    'roomNum': '102'
                };
                chai.request(server)
                    .put('/bookings/1000202/amount')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        //expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Booking Edited successfully');
                        done();
                    });
            });
        });
        describe('Booking Not Edited', function () {
            it('should return a message for Booking Not Edited', function (done) {
                let booking = {
                    'customerID': 100022,
                    'paymenttype': 'Visa',
                    'date': 20181029,
                    'amount': 1,
                    'roomNum': '102'
                };
                chai.request(server)
                    .put('/booking/1000/amount')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.be.a('object');
                        done();
                    });
            });
        });
    });
    after(function(done){
        try{
            db.collection('bookings').remove({'customerID': { $in: [1000202, 10000323, 10009340, 21000000] }});

            done();
        }catch (e) {
            //print(e);
            console.log(e);
        }
    });



    describe('DELETE /bookings/:customerID', function () {
        describe('Booking Successfully Deleted!', function () {
            it('should return confirmation message and delete a booking', function (done) {
                chai.request(server)
                    .delete('/bookings/1000202')
                    .end(function () {
                    //.end(function (err, res) {
                        done();

                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/bookings')
                    .end(function (err, res) {
                        let result = _.map(res.body, (booking) => {
                            return {
                                customerID: booking.customerID,
                                paymenttype: booking.paymenttype,
                                date: booking.date,
                                amount: booking.amount,
                                roomNum: booking.roomNum,
                                price: booking.price
                            };
                        });
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        expect(result).to.include({
                            'customerID': 10000323,
                            'paymenttype': 'Master',
                            'date': 20181030,
                            'amount': 1,
                            'roomNum': '201',
                            'price': 35

                        });
                        done();
                    });


                describe('Booking Not Deleted!!', function () {
                    it('should return a message for booking not deleted', function (done) {
                        chai.request(server)
                            .delete('/booking/19029')
                            .end(function (err, res) {
                                expect(res).to.have.status(404);
                                done();

                            });
                    });
                    after(function (done) {
                        chai.request(server)
                            .get('/bookings')
                            .end(function (err, res) {
                                let result = _.map(res.body, (booking) => {
                                    return {

                                        customerID: booking.customerID,
                                        paymenttype: booking.paymenttype,
                                        date: booking.date,
                                        amount: booking.amount,
                                        roomNum: booking.roomNum,
                                        price: booking.price
                                    };
                                });
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.equal(4);
                                expect(result).to.include({
                                    'customerID': 1000202,
                                    'paymenttype': 'Visa',
                                    'date': 20181029,
                                    'amount': 2,
                                    'roomNum': 102,
                                    'price': 30
                                });

                            });
                        done();
                    });//end after
                });//end describe
            });
        });
    });

    describe('GET /bookings/:amount', () => {
        it('should return the total amount of bookings', function (done) {
            let booking =[
                { 'customerID': 1000202,
                    'paymenttype': 'Visa',
                    'date': 20181029,
                    'amount': 1,
                    'roomNum': '102',
                    'price': 30},

                {
                    'customerID': 10000323,
                    'paymenttype': 'Master',
                    'date': 20181030,
                    'amount': 1,
                    'roomNum': '201',
                    'price': 35
                },
                {
                    'customerID': 10009340,
                    'paymenttype': 'Direct',
                    'date': 20181203,
                    'amount': 1,
                    'roomNum': '303',
                    'price': 30
                }
            ];

            chai.request(server)
                .get('/bookings/amount')
                .send(booking)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('totalamount').equal(3);

                    done();
                });
        });
    });



});

