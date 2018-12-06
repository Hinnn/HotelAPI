/*const rooms = [
    {roomID: 101, price :30,  type : "single"},
    {roomID: 102, price :30,  type : "single"},
    {roomID: 103, price :40,  type : "double"},
    {roomID: 104, price :30,  type : "single"},
    {roomID: 201, price :50,  type : "double"},
    {roomID: 202, price :50, type : "double"},
    {roomID: 203, price :40, type : "single"},
    {roomID: 204, price :40, type : "single"},
    {roomID: 301, price :20, type : "single"},
    {roomID: 302, price :20,  type : "single"},
    {roomID: 303, price :35,  type : "double"}

];
module.exports = rooms;
//state : "free",*/

let mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
    roomNum: String,
    price: Number,
    type : String
},
{ collection: 'roomsdb' });

module.exports = mongoose.model('Room', RoomSchema);