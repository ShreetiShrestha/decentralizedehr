var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');

var PatientSchema = new Schema({
    username: {type: String},
    email: {type: String},
    ethAddr: {type: String},

    personalDetail: {
        firstName: {type: String},
        lastName: {type: String},
        middleName: {type: String},
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
        bloodGroup: {type: String},
        emergencyContact: {
            type: Number,
            validate: {
                validator: function(v) {
                    return /d{10}/.test(v);
                },
                message: '{VALUE} is not a valid 10 digit number!'
            }
        },
        profilePic: {type: String} 
    },

    vitalSign: [{
        name: {type: String},
        date: {type: Date, 'default': Date.now},
        status: {type: String},
        value: {type: Number},
        unit: {type: String},
        notes: {type: String}
    }],

    allergies: [{
        name: {type: String},
        reaction: {type: String},
        allergenType: {type: String},
        severity: {type: String, enum: [1,2,3,4,5]},
        firstObserved: {type: Date},
        currentlyActive: {type: Boolean},
        note: {type: String}
    }],

    medications: [{
        name: {type: String},
        dose: {type: String},
        frequency: {type: Number},
        timeInterval: {type: String},
        strength: {type: Number},
        medicationType: {type: String},
        prescribedBy: {
            type: Schema.Types.ObjectId,
            ref: "Doctor"
        },
        instructions: {type: String},
        reasonsForTaking: {type: String},
        startDate: {type: Date},
        endDate: {type: Date},
        currentlyTaking: {type: Boolean},
        notes: {type: String}
    }],

    immunization: [{
        name: {type: String},
        type: {type: String},
        givenBy: {type: String},
        dose: {type: String},
        date: {type: Date},
        note: {type: String}
    }],

    surgicalHistory: [{
        procedureType: {type: String},
        date: {type: Date},
        hospital: {type: String},
        bodyLocation: {type: String},
        operatedBy: {
            type: Schema.Types.ObjectId,
            ref: "Doctor"
        },
        surgicalNotes: {type: String},
        physicianNotes: {type: String},
        anesthesiaNotes: {type: String},
        consequence: {type: String}
    }],

    reports: [{
         filename: {type: String},
         title: {type: String},
         description: {type: String},
         docEdited: {
             type: Schema.Types.ObjectId,
             ref: "Doctor"
         }
    }]
});

module.exports = mongoose.model('Patient', PatientSchema);