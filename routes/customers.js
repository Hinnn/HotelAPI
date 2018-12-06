//let bookings = require('../models/bookings');
const mongoose = require('mongoose');
//let Customer = require('../models/customers');
import Customer from '../models/customers';
import express from 'express';
//let express = require('express');
let router = express.Router();

let mongodbUri ='mongodb://YueWang:bookings999@ds135179.mlab.com:35179/bookings';

mongoose.connect(mongodbUri);

//mongoose.connect('mongodb://localhost:27017/customersdb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] in mLab.com ');
});

router.signUp = (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    var customer = new Customer();
    customer.customerID = req.body.customerID;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = req.body.password;
    customer.save(function(err) {
        if (err)
            res.json({ message: 'Fail to Sign up !', errmsg : err } );
        else
        // res.json({ message: 'Customer sign up Successfully!', data: customer });
            res.json({ message: 'Sign up Successfully!'});
    });
};

router.login = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    Customer.findOne({email:req.params.email},function(err, customer) {
        //console.log(customer);
        //console.log(customer.password);
        //console.log(req.body.password);
        //console.log(err);
        if (customer == null)
            res.json({message: 'Username Not Found!', errmsg: err});
        else{

            //let c = customer.toObject();
            if(customer.password != req.body.password)
                res.json({message: 'Wrong password!', errmsg: err});
            else
                res.json({message: 'Log in successfully!!'});
        }

    });
};


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(customers,null,5));
    Customer.find(function(err, customers) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(customers,null,5));
    });
};
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    /* var customer = getByValue(customers,req.params.customerID);
    // Create a donation variable and use the helper function to find
    // req.params.id in our booking array
    if (customer != null)
        res.send(JSON.stringify(customer,null,5));//value,replacer,spacing
    else
        res.send('Customer does not exist!!');
    // Then either return the found room or a suitable error message*/
    Customer.find({ 'customerID' : req.params.customerID },function(err, customer) {
        if (err)
            res.json({ message: 'Customer NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(customer,null,5));
    });
};


/*function getByValue(array, customerID) {
    var result  = array.filter(function(obj){return obj.customerID == customerID;} );
    return result ? result[0] : null; // or undefined
}*/



router.deleteCustomer = (req, res) => {
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
    Customer.findOneAndRemove({customerID:req.params.customerID}, function (err) {
        if (!err) {

            res.json({message: 'Customer Successfully Deleted!'});
        }
        else
        //remove(req.params.customerID);
        //res.json({message: 'Booking Successfully Deleted!'});
            res.json({message: 'Customer NOT Found!', errmsg: err});
    });
};


module.exports = router;