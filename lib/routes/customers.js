'use strict';

var _customers = require('../models/customers');

var _customers2 = _interopRequireDefault(_customers);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let bookings = require('../models/bookings');
var mongoose = require('mongoose');
//let Customer = require('../models/customers');

//let express = require('express');
var router = _express2.default.Router();

var mongodbUri = 'mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/customersdb');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] in mLab.com ');
});

router.signUp = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var customer = new _customers2.default();
    customer.customerID = req.body.customerID;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = req.body.password;
    customer.save(function (err) {
        if (err) res.json({ message: 'Fail to Sign up !', errmsg: err });else
            // res.json({ message: 'Customer sign up Successfully!', data: customer });
            res.json({ message: 'Sign up Successfully!' });
    });
};

router.login = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    _customers2.default.findOne({ email: req.params.email }, function (err, customer) {
        //console.log(customer);
        //console.log(customer.password);
        //console.log(req.body.password);
        //console.log(err);
        if (customer == null) res.json({ message: 'Username Not Found!', errmsg: err });else {

            //let c = customer.toObject();
            if (customer.password != req.body.password) res.json({ message: 'Wrong password!', errmsg: err });else res.json({ message: 'Log in successfully!!' });
        }
    });
};

router.findAll = function (req, res) {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(customers,null,5));
    _customers2.default.find(function (err, customers) {
        if (err) res.send(err);

        res.send(JSON.stringify(customers, null, 5));
    });
};
router.findOne = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    /* var customer = getByValue(customers,req.params.customerID);
    // Create a donation variable and use the helper function to find
    // req.params.id in our booking array
    if (customer != null)
        res.send(JSON.stringify(customer,null,5));//value,replacer,spacing
    else
        res.send('Customer does not exist!!');
    // Then either return the found room or a suitable error message*/
    _customers2.default.find({ 'customerID': req.params.customerID }, function (err, customer) {
        if (err) res.json({ message: 'Customer NOT Found!', errmsg: err });else res.send(JSON.stringify(customer, null, 5));
    });
};

/*function getByValue(array, customerID) {
    var result  = array.filter(function(obj){return obj.customerID == customerID;} );
    return result ? result[0] : null; // or undefined
}*/

router.deleteCustomer = function (req, res) {
    /*Delete the selected booking based on its id
    var customer = getByValue(customers,req.params.customerID);
    var index = customers.indexOf(customer);
    var currentSize = customers.length;
    customers.splice(index, 1);
     if((currentSize - 1) === customers.length)
        res.json({ message: 'Customer Deleted!'});
    else
        res.json({ message: 'Customer NOT Deleted!'});
    }*/
    _customers2.default.findOneAndRemove({ customerID: req.params.customerID }, function (err) {
        if (!err) {

            res.json({ message: 'Customer Successfully Deleted!' });
        } else
            //remove(req.params.customerID);
            //res.json({message: 'Booking Successfully Deleted!'});
            res.json({ message: 'Customer NOT Found!', errmsg: err });
    });
};

module.exports = router;