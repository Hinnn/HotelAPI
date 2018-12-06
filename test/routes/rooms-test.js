//let datastore = require('../../models/rooms');
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../../bin/www');
// let expect = chai.expect;
let mongoose = require('mongoose');
import chai from 'chai';
import chaiHttp from 'chai-http' ;
import server from '../../bin/www';
let expect = chai.expect;
import datastore from '../../models/rooms';
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);
let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

// chai.use(chaiHttp);
// chai.use(require('chai-things'));
//let _ = require('lodash');
let room =[
    {     'roomNum': '101',
        'price': 25,
        'type': 'single'},

    {'roomNum': '102',
        'price':30,
        'type':'single'},

    {
        'roomNum': '103',
        'price': 60,
        'type': 'double'
    }
];

let db = mongoose.connection;

describe('Rooms', () => {
    before(function (done) {

        mongoose.connect(mongodbUri, {useNewUrlParser: true}, function (err) {
            if (err)
                console.log('Connection Error:' + err);
            else
                console.log('  ');
        });
        try {
            db.collection('roomsdb').insertMany(room);
            console.log('Rooms insert successfully.');
        } catch (e) {
            // eslint-disable-next-line no-unused-vars   
            //print(e);
            console.log(e);
        }
        done();

    });
    after(function (done) {

        db.collection('roomsdb').remove({'roomNum': {$in: ['101', '102', '103', '201']}});
        done();
    });

    describe('GET /rooms', () => {
        it('should return all the rooms in an array', function (done) {
            chai.request(server)
                .get('/rooms')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (room) => {
                        return {
                            roomNum: room.roomNum,
                            price: room.price,
                            type: room.type
                        };
                    });
                    expect(result).to.include({
                        'roomNum': '101',
                        'price': 25,
                        'type': 'single'
                    });

                    done();
                });
        });
    });


    describe('GET /rooms/:roomNum', () => {
        it('should return a room with the specific roomNum', function (done) {
            chai.request(server)
                .get('/rooms/101')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (rooms) => {
                        return {
                            roomNum: rooms.roomNum,
                            price: rooms.price,
                            type: rooms.type
                        };
                    });
                    expect(result).to.include({
                        'roomNum': '101',
                        'price': 25,
                        'type': 'single'
                    });
                    done();

                });

        });
    });

    describe('POST /rooms', function () {
        it('should return confirmation message and update datastore', function (done) {
            let room = {
                'roomNum': '201',
                'price': 25,
                'type':'single'
            };
            chai.request(server)
                .post('/rooms')
                .send(room)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Room Successfully Added!');
                    done();

                });
        });
        after(function (done) {
            chai.request(server)
                .get('/rooms')
                .end(function (err, res) {
                    let result = _.map(res.body, (room) => {
                        return {

                            roomNum: room.roomNum,
                            price: room.price,
                            type: room.type
                        };
                    });
                    expect(result).to.include({
                        'roomNum': '201',
                        'price': 25,
                        'type':'single'
                    });
                    done();
                });
        });
    });
    after(function(done){
        try{
            db.collection('roomsdb').remove({'roomNum': {$in: ['101', '102', '103', '201']}});
            done();
        }catch (e) {
            // eslint-disable-next-line no-unused-vars
            //print(e);
            console.log(e);
        }
    });

    describe('PUT/rooms/:roomNum/price',()=> {
        describe('Room Edited Successfully', function () {
            it('should return a message and the room detail is edited', function (done) {
                let room = {
                    'roomNum': '101',
                    'price': 25,
                    'type': 'single'
                };
                chai.request(server)
                    .put('/rooms/101/price')
                    .send(room)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        //expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Room Edited successfully');
                        done();
                    });
            });
        });
        describe('Room Not Edited', function () {
            it('should return a message for Room Not Edited', function (done) {
                let room = {
                    'roomNum': '101',
                    'price': 25,
                    'type': 'single'
                };
                chai.request(server)
                    .put('/room/1000/price')
                    .send(room)
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
            db.collection('roomsdb').remove({'roomNum': {$in: ['101', '102', '103', '201']}});
            done();
        }catch (e) {
            // eslint-disable-next-line no-unused-vars
            //print(e);
            console.log(e);
        }
    });



    describe('DELETE /rooms/:roomNum', function () {
        describe('Room Successfully Deleted!', function () {
            it('should return confirmation message and delete a room', function (done) {
                chai.request(server)
                    .delete('/rooms/101')
                    // eslint-disable-next-line no-unused-vars
                    .end(function (err, res) {
                        done();

                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/rooms')
                    .end(function (err, res) {
                        let result = _.map(res.body, (room) => {
                            return {
                                roomNum: room.roomNum,
                                price: room.price,
                                type: room.type
                            };
                        });
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        expect(result).to.include({
                            'roomNum': '102',
                            'price':30,
                            'type':'single'

                        });
                        done();
                    });

                after(function(done){
                    try{
                        db.collection('roomsdb').remove({'roomNum': {$in: ['101', '102', '103', '201']}});
                        done();
                    }catch (e) {
                        // eslint-disable-next-line no-unused-vars
                        //print(e);
                        console.log(e);
                    }
                });
                describe('Room Not Deleted!!', function () {
                    it('should return a message for room not deleted', function (done) {
                        chai.request(server)
                            .delete('/room/190')
                            .end(function (err, res) {
                                expect(res).to.have.status(404);
                                done();

                            });
                    });
                    after(function (done) {
                        chai.request(server)
                            .get('/rooms')
                            .end(function (err, res) {
                                let result = _.map(res.body, (room) => {
                                    return {

                                        roomNum: room.roomNum,
                                        price: room.price,
                                        type: room.type
                                    };
                                });
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.equal(4);
                                expect(result).to.include({
                                    'roomNum': '101',
                                    'price': 25,
                                    'type': 'single'
                                });

                            });
                        done();
                    });//end after
                });//end describe
                after(function(done){
                    try{
                        db.collection('roomsdb').remove({'roomNum': {$in: ['101', '102', '103', '201']}});
                        done();
                    }catch (e) {
                        // eslint-disable-next-line no-unused-vars
                        //print(e);
                        console.log(e);
                    }
                });
            });
        });
    });

});

