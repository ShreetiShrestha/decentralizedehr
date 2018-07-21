var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var DoctorSchema = new Schema({
    username: {type: String},
    email: {type: String},
    ethAddr: {type: String, unique: true},
    validDoc: {type: Boolean, default:false},
    voteCount: {type: Number, default:0},

    personalDetail: {
        firstName: {type: String},
        lastName: {type: String},
        middleName: {type: String},
        gender: {type: String, enum: ["Male", "Female"]},
        dob: {type: Date},
        address: {type: String},
        contact: {type: Number},
        specializationDesc:  {type: String},
        nmc: {type: String},
        hospitals: [{
            type: String
        }],
        profilePic: {type: String} 
    },
});
DoctorSchema.virtual('uniqueId')
.get(function(){
    return this.personalDetail.profilePic.replace(path.extname(this.personalDetail.profilePic), '');
});
module.exports = mongoose.model('Doctor', DoctorSchema);