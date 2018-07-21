var Models = require('../models');
const fs = require('fs');
module.exports = {
    index: function (req, res) {
        var viewModel = {
            patient: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('patientdashboard', viewModel);
            }
        });
    },
    allergies: function (req, res) {
        var viewModel = {
            patient: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('allergies', viewModel);
            }
        });
    },
    immunization: function (req, res) {
        var viewModel = {
            patient: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('immunization', viewModel);
            }
        });
    },
    vitalsigns: function (req, res) {
        var viewModel = {
            patient: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('vitalSigns', viewModel);
            }
        });
    },
    surgicalhistory: function (req, res) {

        var viewModel = {
            doctors: [],
            patient: {}
        };
        Models.Doctor.find(function (err, doctors) {
            if (err) {
                throw err;
            }
            for (index = 0; index < doctors.length; ++index) {
                if (doctors[index].validDoc) {
                    viewModel.doctors.push(doctors[index].personalDetail.firstName + " " + doctors[index].personalDetail.lastName);
                }
            }
        });
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('surgicalHistory', viewModel);
            }
        });
    },
    medications: function (req, res) {
        var viewModel = {
            doctors: [],
            patient: {}
        };
        Models.Doctor.find(function (err, doctors) {
            if (err) {
                throw err;
            }
            for (index = 0; index < doctors.length; ++index) {
                if (doctors[index].validDoc) {
                    viewModel.doctors.push(doctors[index].personalDetail.firstName + " " + doctors[index].personalDetail.lastName);
                }
            }
        });
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('medications', viewModel);
            }
        });
    },
    personaldetail: function (req, res) {
        var viewModel = {
            patient: {},
            BG: [{
                    'bg_id': 1,
                    "value": "A+"
                },
                {
                    'bg_id': 2,
                    "value": "A-"
                },
                {
                    'bg_id': 3,
                    "value": "B+"
                },
                {
                    'bg_id': 4,
                    "value": "B-"
                },
                {
                    'bg_id': 5,
                    "value": "AB+"
                },
                {
                    'bg_id': 6,
                    "value": "AB-"
                },
                {
                    'bg_id': 7,
                    "value": "O+"
                },
                {
                    'bg_id': 8,
                    "value": "O-"
                },
            ],

        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('personalDetails', viewModel);
            }
        });
    },
    reports: function (req, res) {
        var viewModel = {
            patient: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {

                viewModel.patient = patient;
                res.render('reports', viewModel);
            }
        });
    },
    vitalsignssubmit: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: {
                'vitalSign': {
                    'name': req.body.name,
                    'date': req.body.dateOfNote,
                    'status': req.body.status,
                    'value': req.body.value,
                    'unit': req.body.unit,
                    'note': req.body.note
                }
            }
        }, function (err, result) {
            if (err) throw err;
        }, false, true);
        res.redirect('/patient/' + req.params.firstAccount);
    },
    allergiessubmit: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: {
                'allergies': {
                    'name': req.body.name,
                    'reaction': req.body.reaction,
                    'allergenType': req.body.allergentype,
                    'severity': req.body.severity,
                    'firstObserved': req.body.firstobserved,
                    'currentlyActive': req.body.iCheck,
                    'note': req.body.note
                }
            }
        }, function (err, result) {
            if (err) throw err;
        }, false, true);
        res.redirect('/patient/' + req.params.firstAccount);
    },
    immunizationsubmit: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: {
                'immunization': {
                    'name': req.body.name,
                    'type': req.body.type,
                    'givenBy': req.body.givenBy,
                    'dose': req.body.dose,
                    'date': req.body.date,
                    'note': req.body.note
                }
            }
        }, function (err, result) {
            if (err) throw err;
        }, false, true);
        res.redirect('/patient/' + req.params.firstAccount);
    },
    surgicalhistorysubmit: function (req, res) {

        Models.Doctor.findOne({
            'personalDetail.firstName': {
                $regex: req.body.operatedby.split(" ")[0]
            }
        }, function (err, doctor) {
            if (err) {
                throw err;
            }
            docID = doctor.id;
            Models.Patient.update({
                'ethAddr': req.params.firstAccount
            }, {
                $addToSet: {
                    'surgicalHistory': {
                        'procedureType': req.body.procedureType,
                        'date': req.body.date,
                        'hospital': req.body.hospital,
                        'bodyLocation': req.body.bodyLocation,
                        'operatedBy': docID,
                        'surgicalNotes': req.body.surgicalNotes,
                        'physicianNotes': req.body.physicianNotes,
                        'anaesthesiaNotes': req.body.anaesthesiaNotes,
                        'consequence': req.body.consequence,
                    }
                }
            }, function (err, result) {
                if (err) throw err;
            }, false, true);
        });

        res.redirect('/patient/' + req.params.firstAccount);
    },
    medicationssubmit: function (req, res) {

        Models.Doctor.findOne({
            'personalDetail.firstName': {
                $regex: req.body.prescribedBy.split(" ")[0]
            }
        }, function (err, doctor) {
            if (err) {
                throw err;
            }
            docID = doctor.id;
            Models.Patient.update({
                'ethAddr': req.params.firstAccount
            }, {
                $addToSet: {
                    'medications': {
                        'name': req.body.name,
                        'dose': req.body.dose,
                        'frequency': req.body.frequency,
                        'timeInterval': req.body.timeInterval,
                        'strength': req.body.strength,
                        'medicationType': req.body.medicationType,
                        'prescribedBy': docID,
                        'instructions': req.body.instructions,
                        'reasonsForTaking': req.body.reasons,
                        'startDate': req.body.startDate,
                        'endDate': req.body.endDate,
                        'currentlyTaking': req.body.currentlyTaking,
                        'notes': req.body.notes
                    }
                }
            }, function (err, result) {
                if (err) throw err;
            }, false, true);
        });

        res.redirect('/patient/' + req.params.firstAccount);
    },
    personalDetailedit: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $set: {
                'personalDetail': {
                    'firstName': req.body.firstname,
                    'middleName': req.body.middlename,
                    'lastName': req.body.lastname,
                    'gender': req.body.gender,
                    'dob': req.body.dob,
                    'address': req.body.address,
                    'contact': req.body.contact,
                    'bloodGroup': req.body.bloodgroup,
                    'emergencyContact': req.body.econtact,
                    // 'profilePic':req.body.dose
                }
            }
        }, function (err, result) {
            if (err) throw err;
        }, false, true);
        res.redirect('/patient/' + req.params.firstAccount);
    },
    sharedoc: function (req, res) {
        Models.Patient.findOne({
            'ethAddr': req.params.firstAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                data = (JSON.stringify(patient, null, '\t'));
                fs.writeFile('patient.json', data, (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });
                res.redirect('/patient/' + req.params.firstAccount);
            }
        });
    }
}