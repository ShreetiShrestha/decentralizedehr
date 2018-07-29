var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var LinkSchema = new Schema({
       
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "Doctor"
    }
});


// var connect =  mongoose.model('Link', LinkSchema);
// connect.collection.insert({hash : 'aabs'});

module.exports= mongoose.model('Link', LinkSchema);
