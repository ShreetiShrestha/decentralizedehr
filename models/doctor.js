var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var DoctorSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    ethAddr: {type: String, unique: true},
    validDoc: {type: Boolean},

    personalDetail: {
        firstName: {type: String},
        lastName: {type: String},
        gender: {type: String, enum: ["Male", "Female"]},
        dob: {type: Date},
        address: {type: String},
        contact: {
            type: Number,
            validate: {
                validator: function(v) {
                    return /d{10}/.test(v);
                },
                message: '{VALUE} is not a valid 10 digit number!'
            }
        },
        specializationDesc:  {type: String},
        nmc: {type: String},
        hospitals: [{
            type: String
        }],
        profilePic: {type: String} 
    },
});

module.exports = mongoose.model('Doctor', DoctorSchema);