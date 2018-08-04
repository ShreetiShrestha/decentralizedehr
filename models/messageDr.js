var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var MessageDrSchema = new Schema({
    message: [{
        text: {type: String},
        date: {type : Date}
    }],
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor"
    },
    doctorName :{
        type :String
    }
    
});
// var connect =  mongoose.model('MessageDr', MessageDrSchema);
// connect.collection.insert({doctorName : 'aabs'});
module.exports= mongoose.model('MessageDr', MessageDrSchema);
