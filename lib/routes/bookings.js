'use strict';

var _bookings = require('../models/bookings');

var _bookings2 = _interopRequireDefault(_bookings);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
//let Booking = require('../models/bookings');
//let express = require('express');

var router = _express2.default.Router();

//let uriUtil = require('mongodb-uri');

var mongodbUri = 'mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/bookingsdb');

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
    // res.send(JSON.stringify(bookings,null,5));
    _bookings2.default.find(function (err, bookings) {
        if (err) res.send(err);

        res.send(JSON.stringify(bookings, null, 5));
    });
};
router.findOne = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    /* var booking = getByValue(bookings,req.params.orderID);
    // Create a donation variable and use the helper function to find req.params.id in our booking array
    if (booking != null)
        res.send(JSON.stringify(booking,null,5));//value,replacer,spacing
    else
        res.send('Booking NOT Found!!');
    // Then either return the found donation or a suitable error message*/
    _bookings2.default.find({ 'customerID': req.params.customerID }, function (err, booking) {
        // Booking.find({ "_id" : req.params._id },function(err, booking) {
        if (err) res.json({ message: 'Booking NOT Found!', errmsg: err });else res.send(JSON.stringify(booking, null, 5));
    });
};

/*function getByValue(array, orderID) {
    var result  = array.filter(function(obj){return obj.orderID == orderID;} );
    return result ? result[0] : null; // or undefined
}*/

function getTotalAmount(array) {
    var totalAmount = 0;
    array.forEach(function (obj) {
        totalAmount += obj.amount;
    });
    return totalAmount;
}

router.addBooking = function (req, res) {
    /*Add a new booking to our list
    var orderID = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an orderid
    var currentSize = bookings.length;
    //var customerID = require('../models/customers');
    //var roomID = require('../models/rooms');
    bookings.push({"orderID" : orderID, customerID: req.params.customerID, "paymenttype" : req.body.paymenttype,
        "date": req.body.date,"amount" : req.body.amount, "roomID" : req.body.roomID, "price" : req.body.price});
     if((currentSize + 1) == bookings.length)
        res.json({ message: 'Booking Added Successfully!'});
    else
        res.json({ message: 'Booking NOT Added!'});*/
    res.setHeader('Content-Type', 'application/json');
    var booking = new _bookings2.default();
    //var orderID = Math.floor((Math.random() * 1000000) + 1);
    // booking.customerID = req.params.customerID;

    //booking.orderID = req.params.orderID;
    //booking.orderID = Math.floor((Math.random() * 1000000) + 1);
    booking.customerID = req.body.customerID;
    booking.paymenttype = req.body.paymenttype;
    booking.date = req.body.date;
    booking.amount = req.body.amount;
    booking.roomNum = req.body.roomNum;
    booking.price = req.body.price;
    booking.save(function (err) {
        if (err) res.json({ message: 'Booking NOT Added!', errmsg: err });else res.json({ message: 'Booking Successfully Added!', data: booking });
    });
};

router.incrementAmount = function (req, res) {

    // Find the relevant booking based on params id passed in

    res.setHeader('Content-Type', 'application/json');
    var booking = new _bookings2.default({
        //customerID: req.body.customerID,
        paymenttype: req.body.paymenttype,
        date: req.body.date,
        amount: req.body.amount,
        roomNum: req.body.roomNum,
        price: req.body.price

    });
    _bookings2.default.update({ 'customerID': req.params.customerID }, {
        paymenttype: req.body.paymenttype,
        date: req.body.date,
        amount: req.body.amount,
        roomNum: req.body.roomNum,
        price: req.body.price
    }, function (err, booking) {
        if (err) res.json({ message: 'Booking Not Edited', errmsg: err });else res.json({ message: 'Booking Edited successfully', data: booking });
    });
};

/*Booking.findOneAndUpdate({customerID:{$in:req.body.customerID}}, {$inc:{amount:1}}, function (err,booking) {

        if (err)
            res.json({message: 'Booking NOT Found!', errmsg: err});
        else
            //booking.amount += 1;
           // booking.save(function (err) {
               // if (err)
                   // res.json({message: ' Amount not added!', errmsg: err});
               // else

                    res.json({message: 'Booking Increased!', data: booking});
            });
   // });
}*/

router.deleteBooking = function (req, res) {
    //Delete the selected booking based on its id
    // Booking.find({ "customerID" : req.params.customerID},function(err) {
    _bookings2.default.findOneAndRemove({ customerID: req.params.customerID }, function (err) {
        //Booking.findByIdAndRemove({id:req.params.id},function (err){
        if (!err) {
            //res.json({message: 'Booking NOT Found!', errmsg: err});
            //console.log(booking.customerID + "deleted");
            res.json({ message: 'Booking Successfully Deleted!' });
        } else
            //remove(req.params.customerID);
            //res.json({message: 'Booking Successfully Deleted!'});
            res.json({ message: 'Booking NOT Found!', errmsg: err });
    });
};

router.findTotalAmount = function (req, res) {
    /*
        let amount = getTotalAmount(bookings);
        res.json({totalamount : amount});*/
    _bookings2.default.find(function (err, bookings) {
        if (err) res.send(err);else res.json({ totalamount: getTotalAmount(bookings) });
    });
};

module.exports = router;