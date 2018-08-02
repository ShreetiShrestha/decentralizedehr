var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var MessageSchema = new Schema({
    message: [{
        text: {type: String},
    }
    ],
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor"
    }
});

module.exports= mongoose.model('Message', MessageSchema);
