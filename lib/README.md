Assignment 1 - API testing and Source Control.

Name: Yue Wang

## Overview.

Based on the web app development assignment, I added these test code to make sure that there is no mistake. It contains three test files: bookings-test, rooms-test and customers-test. I have connected it with mLab and also I use before and after functions to make sure the datas sotred in the database keep the data unchanged no matter what we do in each describe function.

## API endpoints.

 + GET /bookings - Get all bookings.
 + GET /bookings/:customerID - Get a booking with the specific customerID.
 + POST /bookings/:customerID - Add a booking with specific customerID.
 + PUT /bookings/:customerID/amount - Edit the amount of the customer's booking.
 + DELETE /bookings/:customerID - Delete a booking by customerID.
 + GET /bookings/:amount - Get total amount of bookings.
 + GET /rooms - Get all rooms.
 + GET /rooms/:roomNum - Get a room with the specific roomNum.
 + POST /rooms - Add a room.
 + PUT /rooms/:roomNum/price - Edit the price of the room.
 + DELETE /rooms/:roomNumID - Delete a room by roomNum.
 + POST /customers - Customer sign up.
 + POST /customers/:email - Customer log in.
 + GET /customers - Get all customers.
 + GET /customers/:customerID - Get a customer with the specific customerID.
 + DELETE /customers/:customerID - Delete a customer by customerID.

## Data storage.
I have connected it with mLab. There are three collections named bookingsdb, roomsdb and customersdb and also three schemas named bookings,customers and rooms.

    let BookingSchema = new mongoose.Schema({
    customerID: Number,
    paymenttype: String,
    date: Number,
    amount: Number,
    roomNum: String,
    price: Number
    },
    { collection: 'bookingsdb' });
    module.exports = mongoose.model('Booking', BookingSchema);

    let RoomSchema = new mongoose.Schema({
    roomNum: String,
    price: Number,
    type : String
    },
    { collection: 'roomsdb' });
    module.exports = mongoose.model('Room', RoomSchema);

    let CustomerSchema = new mongoose.Schema({
    customerID: Number,
    name: String,
    email : String,
    password: String
    },
    { collection: 'customersdb' });
    module.exports = mongoose.model('Customer', CustomerSchema);

## Sample Test execution.


        $ npm test
        
        > hotelbooking@0.0.0 test /Users/hin/agile/hotelBooking
        > NODE_ENV=test mocha test/routes/customers-test.js
        
        
        (node:1041) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
        Customers
        POST /customers
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] in mLab.com 
        
        ✓ should return confirmation message and add a customer (287ms)
        POST /customers/:email
        Log in successfully!
        ✓ should return a message for customer sign in successfully
        Username Not Found!
        ✓ should return a message for Username Not Found!
        Wrong password!
        ✓ should return a message for Wrong password!
        GET /customers
        ✓ should return all the customers in an array
        GET /customers/:customerID
        ✓ should return a customer with the specific customerID
        DELETE /customers/customerID
        Customer Successfully Deleted!
        (node:1041) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
        ✓ should return confirmation message and delete a customer
        Customer Not Deleted!!
        ✓ should return a message for customer not deleted
        
        (node:1041) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
        
        8 passing (599ms)
        
        
        $ mocha test/routes/bookings-test.js
        
        
        (node:1045) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
        Bookings
        Booking insert successfully.
        GET /bookings
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] in mLab.com 
        
        ✓ should return all the bookings in an array (319ms)
        GET /bookings/:customerID
        ✓ should return a booking with the specific customerID
        POST /bookings/:customerID
        ✓ should return confirmation message and update datastore (84ms)
        PUT/bookings/:customerID/amount
        Booking Edited Successfully
        (node:1045) DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
        ✓ should return a message and the booking detail is edited
        Booking Not Edited
        ✓ should return a message for Booking Not Edited
        DELETE /bookings/customerID
        Booking Successfully Deleted!
        (node:1045) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
        ✓ should return confirmation message and delete a booking
        GET /bookings/amount
        ✓ should return the total amount of bookings
        
        Booking Not Deleted!!
        (node:1045) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
        ✓ should return a message for booking not deleted
        
        
        8 passing (635ms)
        
        $ mocha test/routes/rooms-test.js
        
        
        (node:1047) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
        Rooms
        Rooms insert successfully.
        GET /rooms
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] 
        Successfully Connected to [ bookings ] in mLab.com 
        
        [ { _id: 5be06d80af461c04172e8be2,
        roomNum: '101',
        price: 25,
        type: 'single' },
        { _id: 5be06d80af461c04172e8be3,
        roomNum: '102',
        price: 30,
        type: 'single' },
        { _id: 5be06d80af461c04172e8be4,
        roomNum: '103',
        price: 60,
        type: 'double' } ]
        ✓ should return all the rooms in an array (284ms)
        GET /rooms/:roomNum
        ✓ should return a room with the specific roomNum
        POST /rooms
        ✓ should return confirmation message and update datastore (53ms)
        [ { _id: 5be06d80af461c04172e8be2,
        roomNum: '101',
        price: 25,
        type: 'single' },
        { _id: 5be06d80af461c04172e8be3,
        roomNum: '102',
        price: 30,
        type: 'single' },
        { _id: 5be06d80af461c04172e8be4,
        roomNum: '103',
        price: 60,
        type: 'double' },
        { _id: 5be06d81af461c04172e8be5,
        roomNum: '201',
        price: 25,
        type: 'single',
        __v: 0 } ]
        PUT/rooms/:roomNum/price
        Room Edited Successfully
        (node:1047) DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
        ✓ should return a message and the room detail is edited (39ms)
        Room Not Edited
        ✓ should return a message for Room Not Edited
        DELETE /rooms/roomNum
        Room Successfully Deleted!
        (node:1047) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
        ✓ should return confirmation message and delete a room
        [ { _id: 5be06d80af461c04172e8be3,
        roomNum: '102',
        price: 30,
        type: 'single' },
        { _id: 5be06d80af461c04172e8be4,
        roomNum: '103',
        price: 60,
        type: 'double' },
        { _id: 5be06d81af461c04172e8be5,
        roomNum: '201',
        price: 25,
        type: 'single',
        __v: 0 } ]
        
        Room Not Deleted!!
        (node:1047) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
        ✓ should return a message for room not deleted
        
        
        7 passing (536ms)
        $


## Extra features.
  At first, I forgot to add some branches, then I created a new branching structure in another folder. 
  But according to the teacher's request, I submitted the original git. Maybe I can put the later branching structure here.
        
        $
        git log
        commit 4a73464a6df98f0b4288f1796cf15ef770953be0 (HEAD -> master, delete-customers-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Sat Nov 3 12:39:13 2018 +0000
        
        Delete customer tested
        
        commit e4c50408e9c066bd01ed8a0e3cb397b0fbc94d6a (get-oneCustomer-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Sat Nov 3 12:26:27 2018 +0000
        
        get a customer tested
        
        commit 8b8046b4452f9a58716856064279ae8acccd4a05 (get-customers-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Sat Nov 3 12:20:53 2018 +0000
        
        Get all customers
        
        commit 41efee55b9ba58c0a0215b9464cae08ea123db8f (login-customers-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Sat Nov 3 12:15:01 2018 +0000
        
        Customer sign up
        
        commit 46934b6daf2eb0cbcdd24c7451186ff6fb56895c (signup-customers-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Fri Nov 2 17:14:12 2018 +0000
        
        customer sign up tested
        
        commit 0a000da113546078a3ef40bbd1ae7fc2a3052846 (delete-rooms-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Fri Nov 2 14:57:26 2018 +0000
        
        Delete room tested
        
        commit 101fa7884d7d27ad1d2966378981ab33fa719b12 (increasePrice-rooms-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Fri Nov 2 14:55:31 2018 +0000
        
        Add price tested
        
        commit f3a9c555fe363e57fa7a5029d7d2573a4e3c25a0 (add-rooms-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Fri Nov 2 14:52:53 2018 +0000
        
        add rooms tested
        
        commit 814cbed2b72c012d975686beb14815a01b62f2db (get-oneRoom-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Fri Nov 2 14:48:53 2018 +0000
        
        Get room tested
        commit 8857374a9276635aefd4a92f8f25207a7826ba90 (get-rooms-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 20:14:20 2018 +0000
        
        Get all Rooms tested
        
        commit e84b2af2d77539e330fa26057f981cdeda9d0641 (gettotalAmount-bookings-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 20:11:00 2018 +0000
        
        Get total amount of bookings tested
        
        commit be8234a1b68ad1b4431ba19654884a4ea861e598 (delete-bookings-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 20:07:41 2018 +0000
        
        Delete Bookings tested
        
        commit e263b29bab81dd47acb6baef9238df9199d4be29 (edit-bookings-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 20:05:23 2018 +0000
        
        edit booking tested
        
        commit 7062609c37f1fd6f6a786164371a5b58f9c42d40 (add-bookings-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 20:01:51 2018 +0000
        
        Add Booking Tested
        
        commit 7e038c6c0be7642f54aaec3169ccfb9cd52b1d17 (get-bookings-test)
        Author: Yue Wang <hin@Yue-Wang.local>
        Date:   Thu Nov 1 19:59:27 2018 +0000
        
        Get bookings test
        $
        https://github.com/Hinnn/hotelBooking-tests
        
