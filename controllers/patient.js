var Models = require('../models'),
    multer = require('multer'),
    path = require('path'),
    ipfsAPI = require('ipfs-api'),
    QRCode = require('qrcode'),
    // ursa = require('ursa'),
    fs = require('fs');
let ipfs = ipfsAPI('ipfs.infura.io', '5001', {
    protocol: 'https'
});
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
            users: [],
            patient: {}
        };

        Models.Doctor.find(function (err, doctors) {
            if (err) {
                throw err;
            }
            for (index = 0; index < doctors.length; ++index) {
                if (doctors[index].validDoc) {
                    viewModel.users.push(doctors[index].personalDetail.firstName + " " + doctors[index].personalDetail.lastName);
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
                viewModel.users.push(patient.personalDetail.firstName + " " + patient.personalDetail.lastName);
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
                    'dateOfNote': req.body.dateOfNote,
                    'status': req.body.status,
                    'value': req.body.value,
                    'unit': req.body.unit,
                    'notes': req.body.notes
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
                    'currentlyActive': req.body.currentlyactive,
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
                        'hospital': req.body.hospitalName,
                        'bodyLocation': req.body.bodyLocation,
                        'operatedBy': docID,
                        'surgicalNotes': req.body.surgicalNotes,
                        'physicianNotes': req.body.physicianNotes,
                        'anesthesiaNotes': req.body.anaesthesiaNotes,
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
    reportssubmit: function (req, res) {
        pathFile = req.file.path;
        nameFile = req.file.originalname;
        acc = req.params.firstAccount;
        title = req.body.title;
        desc = req.body.description;
        Models.Doctor.findOne({
            'personalDetail.firstName': {
                $regex: req.body.addedBy.split(" ")[0]
            }
        }, function (err, doctor, req) {
            if (err) {
                throw err;
            }
            docID = doctor.id;
            console.log(req);
            var saveFile = function (req) {
                var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                    fileUrl = ' ';

                for (var i = 0; i < 6; i++) {
                    fileUrl += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                var tempPath = pathFile,
                    ext = path.extname(nameFile).toLowerCase();
                var dir = './public/upload/patients/' + acc + '/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                // var dir2 = dir + 'reports/';
                // if (!fs.existsSync(dir2)) {
                //     fs.mkdirSync(dir2);
                // }
                targetPath = path.resolve(dir + fileUrl + ext);
                console.log('account', acc);


                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.pdf' || ext === '.docx') {
                    fs.rename(tempPath, targetPath, function (err, req) {
                        if (err) {
                            throw err;
                        }
                        Models.Patient.update({
                            'ethAddr': acc
                        }, {
                            $addToSet: {
                                'reports': {
                                    'filename': fileUrl + ext,
                                    'title': title,
                                    'description': desc,
                                    'docEdited': docID

                                }
                            }
                        }, function (err, result) {
                            if (err) throw err;
                        }, false, true);
                        var patient = Models.Patient.findOne({
                            'ethAddr': acc
                        });
                        // console.log(patient);
                    });
                } else {
                    fs.unlink(tempPath, function (err) {
                        if (err) throw err;
                        res.json(500, {
                            error: 'The type of Files that were uploaded are unsupported formats.'
                        });
                    });
                }
            };
            saveFile();

            res.redirect('/patient/' + acc);
        });


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


    vitalSignsDetails: function (req, res) {
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
                res.render('vitalSignsDetails', viewModel);
            }
        });
    },
    allergiesDetails: function (req, res) {
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
                res.render('allergiesDetails', viewModel);
            }
        });
    },
    immunizationDetails: function (req, res) {
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
                res.render('immunizationDetails', viewModel);
            }
        });
    },
    surgicalhistoryDetails: function (req, res) {
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
                res.render('surgicalhistoryDetails', viewModel);
            }
        });
    },
    medicationDetails: function (req, res) {
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
                res.render('medicationDetails', viewModel);
            }
        });
    },
    personalDetails: function (req, res) {
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
                res.render('personalDetailss', viewModel);
            }
        });
    },
    reportsDetails: function (req, res) {
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
                res.render('reportsDetails', viewModel);
            }
        });
    },

    getdoc: function (req, res) {
        const validCID = 'QmYqV75oPeiGYJtwCrDkoHjPZ6NUtvT4368WUc4xxWKHFE';

        ipfs.files.get(validCID, function (err, files) {
            files.forEach((file) => {
                console.log(file.path);
                console.log(file.content.toString('utf8'));
            });
        });
        res.redirect('/patient/' + req.params.firstAccount);
    },
    sharedoc: function (req, res) {
        var viewModel = {
            doctors: [],
            patient: {},

        };
        Models.Doctor.find(function (err, doctors) {
            if (err) {
                throw err;
            } else {
                viewModel.doctors = doctors;
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
                res.render('shareToDoc', viewModel);
            }
        });
    },
    retrieveinfo: function (req, res) {
        var viewModel = {
            patient: {},
            dr: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patient = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {

                        viewModel.dr = doctor;
                        res.send(viewModel);
                    }
                });
            }
        });

    },
    share: function (req, res) {
        var viewModel = {
            patient: {},
            drInfo: {}
        }

        acc = req.params.patientAccount;
        Models.Patient.findOne({
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patient = patient;
                data = (JSON.stringify(patient, null, '\t'));
                var dir = './public/upload/patients/' + acc + '/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                fs.writeFile(dir + 'JSON' + acc + '.txt', data, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Data written to file');
                });


                Models.Doctor.findOne({
                    'ethAddr': {
                        $regex: req.params.drAccount
                    }
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.drInfo = doctor;
                        var newLink = new Models.Link({
                            patient: patient.id,
                            doctor: doctor.id
                        });
                        newLink.save();
                        
                        fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {
                            console.log(files);
                            for (var i = 0; i < files.length; i++) {
                                testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                var testBuffer = new Buffer(testFile);

                                ipfs.files.add(testBuffer, function (err, output) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(output[0].hash);
                                    Models.Link.update({
                                        'patient': patient.id,
                                        'doctor': doctor.id
                                    }, {
                                        $addToSet: {
                                            'hashes': {
                                                'linkage': output[0].hash
                                            }
                                        }
                                    }, function (err, result) {
                                        if (err) throw err;
                                    }, false, true);
                                    
                                   
                                });
                            }


                        });
                        res.render('Confirmation', viewModel);
                    }
                });



               
                // const validCID = 'QmYqV75oPeiGYJtwCrDkoHjPZ6NUtvT4368WUc4xxWKHFE';
                // QRCode.toDataURL(validCID, function (err, url) {
                //     console.log(url);
                // });

            }
        });
        
    },
};