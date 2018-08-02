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

module.exports= mongoose.model('MessageDr', MessageDrSchema);
