var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var PatientSchema = new Schema({
    username: {type: String, requird: true, unique: true},
    email: {type: String, required: true, unique:true},
    ethAddr: {type: String, unique: true},

    personalDetail: {
        firstName: {type: String},
        lastName: {type: String},
        gender: {type: String, enum: ["Male", "Female"]},
        dob: {type: Date},
        address: {type: String},
        contact: {}
    }
})