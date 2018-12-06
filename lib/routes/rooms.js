'use strict';

var _rooms = require('../models/rooms');

var _rooms2 = _interopRequireDefault(_rooms);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
//let bookings = require('../models/bookings');

//let Room = require('../models/rooms');
//let express = require('express');
var router = _express2.default.Router();

//let uriUtil = require('mongodb-uri');

var mongodbUri = 'mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/roomsdb');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] ');
});

router.findAll = function (req, res) {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(rooms,null,5));
    _rooms2.default.find(function (err, rooms) {
        console.log(rooms);
        if (err) res.send(err);

        res.send(JSON.stringify(rooms, null, 5));
    });
};

/*function getByValue(array, roomNum) {
    var result  = array.filter(function(obj){return obj.roomNum == roomNum;} );
    return result ? result[0] : null; // or undefined
}*/
router.findOne = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    _rooms2.default.find({ 'roomNum': req.params.roomNum }, function (err, room) {
        if (err) res.json({ message: 'Room NOT Found!', errmsg: err });else res.send(JSON.stringify(room, null, 5));
    });
};

router.addRoom = function (req, res) {
    //Add a new room to our list
    res.setHeader('Content-Type', 'application/json');
    var room = new _rooms2.default();
    room.roomNum = req.body.roomNum;
    room.price = req.body.price;
    room.type = req.body.type;
    room.save(function (err) {
        if (err) res.json({ message: 'Room NOT Added!', errmsg: err });else res.json({ message: 'Room Successfully Added!', data: room });
    });
};

router.incrementPrice = function (req, res) {
    // Find the relevant booking based on params id passed in
    // Add 1 to orders property of the selected booking based on its id

    /* Room.findById(req.params.id, function(err,room) {
        if (err)
            res.json({ message: 'Room NOT Found!', errmsg : err } );
        else {
            room.price += 5;
            room.save(function (err) {
                if (err)
                    res.json({ message: ' Room NOT Found -  NOT Successful!', errmsg : err } );
                else
                    res.json({ message: '' + 'Price Increased!', data: room });
            });
        }
    });*/
    res.setHeader('Content-Type', 'application/json');
    var room = new _rooms2.default({

        roomNum: req.body.roomNum,
        price: req.body.price,
        type: req.body.type

    });
    _rooms2.default.update({ 'roomNum': req.params.roomNum }, {
        price: req.body.price,
        type: req.body.type
    },
    //function (err, booking) {
    function (err) {
        if (err) res.json({ message: 'Room Not Edited', errmsg: err });else res.json({ message: 'Room Edited successfully', data: room });
    });
};

/*router.deleteRoom = (req, res) => {

    Room.findByIdAndRemove(req.params.id, function (err) {

        if (err)
            res.json({message: 'Room NOT DELETED!', errmsg: err});
        else
            res.json({message: 'Room Successfully Deleted!'});
    });*/

router.deleteRoom = function (req, res) {

    _rooms2.default.findOneAndRemove({ roomNum: req.params.roomNum }, function (err) {
        if (!err) {
            res.json({ message: 'Room Successfully Deleted!' });
        } else res.json({ message: 'Room NOT Found!', errmsg: err });
    });
};

module.exports = router;