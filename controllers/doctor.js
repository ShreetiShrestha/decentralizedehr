var Models = require('../models'),
    multer = require('multer'),
    path = require('path'),
    ipfsAPI = require('ipfs-api'),
    QRCode = require('qrcode'),
    express = require('express'),
    // ursa = require('ursa'),
    fs = require('fs');
let ipfs = ipfsAPI('ipfs.infura.io', '5001', {
    protocol: 'https'
});
module.exports = {
    index: function (req, res) {
        var viewModel = {
            dr: {},
            validationList: [],
            countlist: {},
            linkslist: []
        };


        Models.Doctor.count({}, function (err, count) {


            if (count <= 3) {
                Models.Doctor.update({
                    'ethAddr': req.params.firstAccount
                }, {
                    $set: {
                        'validDoc': 'true'
                    }
                }, function (err, result) {
                    if (err) throw err;
                });
            }
            Models.Doctor.find(function (err, doctors) {
                if (err) {
                    throw err;
                }
                for (index = 0; index < doctors.length; ++index) {
                    if (doctors[index].validDoc === false) {
                        viewModel.validationList.push(doctors[index]);

                    }
                }
            });
            Models.Doctor.findOne({
                ethAddr: {
                    $regex: req.params.firstAccount
                }
            }, function (err, doctor) {
                validity = doctor.validDoc;
                viewModel.dr = doctor;
                viewModel.countlist.myCount = doctor.voteCount;
                if (validity === true) {
                    Models.Link.find({
                        'doctor': doctor.id
                    }, function (err, links) {
                        if (err) throw err;
                        else {
                            for (var i = 0; i < links.length; i++) {
                                Models.Patient.findOne({
                                    _id: links[i].patient
                                }, function (err, patient) {
                                    if (err) {

                                        throw err;
                                    } else {

                                        viewModel.linkslist.push(patient);
                                    }
                                });

                            }
                        }
                        res.render('drdashboard', viewModel);
                    });

                } else {
                    Models.Doctor.find({
                        'validDoc': true
                    }).count({}, function (err, count) {
                        threshold = Math.ceil(count * .50);

                        viewModel.countlist.dr = count;
                        viewModel.countlist.threshold = threshold;
                        viewModel.countlist.needed = threshold - viewModel.countlist.myCount + 1;
                        Models.Patient.count({}, function (err, countPatient) {
                            viewModel.countlist.patients = countPatient;
                            viewModel.countlist.total = countPatient + viewModel.countlist.dr;
                            res.render('drVotingStatus', viewModel);
                        });
                    });

                }
            });
        });


    },
    personaldetail: function (req, res) {
        var viewModel = {
            dr: {}
        };
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.firstAccount
            }
        }, function (err, doctor) {
            if (err) {
                throw err;
            }
            if (!err && doctor) {

                viewModel.dr = doctor;
                res.render('personalDetails', viewModel);
            }
        });
    },
    personalDetailedit: function (req, res) {

        Models.Doctor.update({
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
                    'specializationDesc': req.body.specializationDesc,
                    'nmc': req.body.nmc,
                    'hospitals': req.body.hospitals
                    // 'profilePic':req.body.dose
                }
            }
        }, function (err, result) {
            if (err) throw err;
        }, false, true);
        res.redirect('/doctor/' + req.params.firstAccount);
    },
    vote: function (req, res) {
        var message = {
            msg: ""
        };
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.candidateAccount
            }
        }, function (err, candidate) {
            if (err) {
                throw err;
            }

            if (!err && candidate) {

                var threshold;

                Models.Doctor.update({
                    'ethAddr': req.params.candidateAccount
                }, {
                    $set: {
                        'voteCount': candidate.voteCount + 1
                    }

                }, function (err, result) {
                    if (err) {
                        throw err;
                    }
                }, false, true);

                Models.Doctor.update({
                    'ethAddr': req.params.voterAccount
                }, {
                    $addToSet: {
                        'votedAccounts': {
                            'acc': req.params.candidateAccount
                        }
                    }

                }, function (err, result) {
                    if (err) {
                        throw err;
                    }
                }, false, true);


                Models.Doctor.find({
                    'validDoc': true
                }).count({}, function (err, count) {
                    threshold = Math.floor(count * .50);
                    if (candidate.voteCount >= threshold) {
                        Models.Doctor.update({
                            'ethAddr': req.params.candidateAccount
                        }, {
                            $set: {
                                'validDoc': true
                            }
                        }, function (err, result) {
                            if (err) {
                                throw err;
                            }
                        }, false, true);

                    }

                });
                res.send({
                    msg: 'Your vote has been received. Thank You',
                });
            }
        });

    },
    patientretrieveinfo: function (req, res) {
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
    retrieve: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {},
            hash: []
        }

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, patient) {
            if (err) throw err;
            else {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': {
                        $regex: req.params.drAccount
                    }
                }, function (error, doctor) {
                    if (error) throw error;
                    else {
                        viewModel.dr = doctor;
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (er, link) {
                            if (er) throw er;
                            else {

                                for (i = 0; i < link.hashes.length; i++) {

                                    viewModel.hash.push(link.hashes[i].linkage);
                                    viewModel.hash.push(link.hashes[i].recordid);
                                }

                                res.send(viewModel);
                            }
                        })
                    }
                })
            }
        })

    },
    patientInfo: function (req, res) {
        var viewModel = {
            dr: {},
            patientInfo: {},
            link: {}
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }

        }, function (err, doctor) {
            if (err) {
                throw err;
            }
            if (!err && doctor) {

                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) {
                        throw err;
                    }
                    if (!err && patient) {
                        viewModel.patientInfo = patient;
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (err) {
                                throw err;
                            }
                            if (!err && link) {
                                viewModel.link = link;

                                res.render('patientRetrieveInfo', viewModel);
                            }
                        });
                    }
                });

            }
        });

    },
    vitalsignslist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {}
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;
                    res.render("vitalsignslist", viewModel);
                });
            }
        });
    },
    vitalsignsdetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.vitalSign.length; i++) {
                    if (result.vitalSign[i].id === req.params.dataid) {

                        res.send({
                            'name': result.vitalSign[i].name,
                            'dateOfNote': result.vitalSign[i].dateOfNote,
                            'status': result.vitalSign[i].status,
                            'value': result.vitalSign[i].value,
                            'unit': result.vitalSign[i].unit,
                            'notes': result.vitalSign[i].notes,
                            'id': result.vitalSign[i].id
                        });
                    }

                }

            }
        });
    },
    vitalsignsadd: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('vitalSigns', viewModel);
                    }
                });
            }
        });
    },
    vitalsignssubmit: function (req, res) {
        acc = req.params.patientAccount;
        Models.Patient.update({
            'ethAddr': req.params.patientAccount
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
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) throw err;
                    else {
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (link === null) {
                                console.log('newlink');
                                var newLink = new Models.Link({
                                    patient: patient.id,
                                    doctor: doctor.id
                                });
                                newLink.save();
                            } else {
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
                                fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                    for (var i = 0; i < files.length; i++) {
                                        testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                        var testBuffer = new Buffer(testFile);
                                        var filename = files[i];
                                        ipfs.files.add(testBuffer, function (err, output) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Files:::", filename);
                                            console.log(output[0].hash);
                                            Models.Link.update({
                                                'patient': patient.id,
                                                'doctor': doctor.id
                                            }, {
                                                $addToSet: {
                                                    'hashes': {
                                                        'linkage': output[0].hash,
                                                        'recordid': filename

                                                    }
                                                }
                                            }, function (err, result) {
                                                if (err) throw err;
                                            }, false, true);


                                        });
                                    }


                                });
                                res.redirect('/doctor/' + doctor.ethAddr);

                            }
                        });
                    }
                });

            }
        });
    },


    allergieslist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {}
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;
                    res.render("allergieslist", viewModel);
                });
            }
        });
    },
    allergiesdetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.allergies.length; i++) {
                    if (result.allergies[i].id === req.params.dataid) {

                        res.send({
                            'name': result.allergies[i].name,
                            'allergenType': result.allergies[i].allergenType,
                            'reaction': result.allergies[i].reaction,
                            'severity': result.allergies[i].severity,
                            'firstObserved': result.allergies[i].firstObserved,
                            'currentlyActive': result.allergies[i].currentlyActive,
                            'note': result.allergies[i].note,
                            'id': result.allergies[i].id
                        });
                    }

                }

            }
        });
    },
    allergiesadd: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {}
        };
        Models.Patient.findOne({
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('allergies', viewModel);
                    }
                });
            }
        });
    },
    allergiessubmit: function (req, res) {
        acc = req.params.patientAccount;
        Models.Patient.update({
            'ethAddr': req.params.patientAccount
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
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) throw err;
                    else {
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (link === null) {
                                console.log('newlink');
                                var newLink = new Models.Link({
                                    patient: patient.id,
                                    doctor: doctor.id
                                });
                                newLink.save();
                            } else {
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
                                fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                    for (var i = 0; i < files.length; i++) {
                                        testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                        var testBuffer = new Buffer(testFile);
                                        var filename = files[i];
                                        ipfs.files.add(testBuffer, function (err, output) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Files:::", filename);
                                            console.log(output[0].hash);
                                            Models.Link.update({
                                                'patient': patient.id,
                                                'doctor': doctor.id
                                            }, {
                                                $addToSet: {
                                                    'hashes': {
                                                        'linkage': output[0].hash,
                                                        'recordid': filename

                                                    }
                                                }
                                            }, function (err, result) {
                                                if (err) throw err;
                                            }, false, true);


                                        });
                                    }


                                });
                                res.redirect('/doctor/' + doctor.ethAddr);

                            }
                        });
                    }
                });

            }
        });
    },

    medicationslist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {},
            pres: ''
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;

                    res.render("medicationslist", viewModel);
                });
            }
        });
    },
    medicationsdetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.medications.length; i++) {
                    if (result.medications[i].id === req.params.dataid) {

                        res.send({

                            'name': result.medications[i].name,
                            'medicationType': result.medications[i].medicationType,
                            'dose': result.medications[i].dose,
                            'frequency': result.medications[i].frequency,
                            'timeInterval': result.medications[i].timeInterval,
                            'strength': result.medications[i].strength,
                            'instructions': result.medications[i].instructions,
                            'prescribedBy': result.medications[i].prescribedBy,
                            'reasonsForTaking': result.medications[i].reasonsForTaking,
                            'startDate': result.medications[i].startDate,
                            'endDate': result.medications[i].endDate,
                            'currentlyTaking': result.medications[i].currentlyTaking,
                            'notes': result.medications[i].notes,
                            'id': result.medications[i].id
                        });
                    }

                }

            }
        });
    },
    medicationsadd: function (req, res) {
        var viewModel = {
            doctors: [],
            patientInfo: {},
            dr: {}
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
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('medications', viewModel);
                    }
                });
            }
        });
    },
    medicationssubmit: function (req, res) {
        acc = req.params.patientAccount;
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
                'ethAddr': req.params.patientAccount
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

        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) throw err;
                    else {
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (link === null) {
                                console.log('newlink');
                                var newLink = new Models.Link({
                                    patient: patient.id,
                                    doctor: doctor.id
                                });
                                newLink.save();
                            } else {
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
                                fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                    for (var i = 0; i < files.length; i++) {
                                        testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                        var testBuffer = new Buffer(testFile);
                                        var filename = files[i];
                                        ipfs.files.add(testBuffer, function (err, output) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Files:::", filename);
                                            console.log(output[0].hash);
                                            Models.Link.update({
                                                'patient': patient.id,
                                                'doctor': doctor.id
                                            }, {
                                                $addToSet: {
                                                    'hashes': {
                                                        'linkage': output[0].hash,
                                                        'recordid': filename

                                                    }
                                                }
                                            }, function (err, result) {
                                                if (err) throw err;
                                            }, false, true);


                                        });
                                    }


                                });
                                res.redirect('/doctor/' + doctor.ethAddr);

                            }
                        });
                    }
                });

            }
        });
    },

    immunizationslist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {},
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;

                    res.render("immunizationslist", viewModel);
                });
            }
        });
    },
    immunizationsdetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.immunization.length; i++) {
                    if (result.immunization[i].id === req.params.dataid) {

                        res.send({
                            'name': result.immunization[i].name,
                            'type': result.immunization[i].type,
                            'dose': result.immunization[i].dose,
                            'date': result.immunization[i].date,
                            'givenBy': result.immunization[i].givenBy,
                            'note': result.immunization[i].note,
                            'id': result.immunization[i].id
                        });
                    }

                }

            }
        });
    },
    immunizationsadd: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {}
        };

        Models.Patient.findOne({
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('immunization', viewModel);
                    }
                });
            }
        });
    },
    immunizationssubmit: function (req, res) {
        acc = req.params.patientAccount;
        Models.Patient.update({
            'ethAddr': req.params.patientAccount
        }, {
            $addToSet: {
                'immunization': {
                    'name': req.body.name,
                    'dose': req.body.dose,
                    'type': req.body.type,
                    'date': req.body.date,
                    'givenBy': req.body.givenBy,
                    'note': req.body.note
                }
            }
        }, function (err, result) {
            if (err) throw err;

        }, false, true);
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) throw err;
                    else {
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (link === null) {
                                console.log('newlink');
                                var newLink = new Models.Link({
                                    patient: patient.id,
                                    doctor: doctor.id
                                });
                                newLink.save();
                            } else {
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
                                fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                    for (var i = 0; i < files.length; i++) {
                                        testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                        var testBuffer = new Buffer(testFile);
                                        var filename = files[i];
                                        ipfs.files.add(testBuffer, function (err, output) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Files:::", filename);
                                            console.log(output[0].hash);
                                            Models.Link.update({
                                                'patient': patient.id,
                                                'doctor': doctor.id
                                            }, {
                                                $addToSet: {
                                                    'hashes': {
                                                        'linkage': output[0].hash,
                                                        'recordid': filename

                                                    }
                                                }
                                            }, function (err, result) {
                                                if (err) throw err;
                                            }, false, true);


                                        });
                                    }


                                });
                                res.redirect('/doctor/' + doctor.ethAddr);

                            }
                        });
                    }
                });

            }
        });
    },

    surgicalHistorylist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {},
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;
                    res.render("surgicalHistorylist", viewModel);
                });
            }
        });
    },
    surgicalHistorydetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.surgicalHistory.length; i++) {
                    if (result.surgicalHistory[i].id === req.params.dataid) {

                        res.send({

                            'procedureType': result.surgicalHistory[i].procedureType,
                            'date': result.surgicalHistory[i].date,
                            'hospital': result.surgicalHistory[i].hospital,
                            'operatedBy': result.surgicalHistory[i].operatedBy,
                            'bodyLocation': result.surgicalHistory[i].bodyLocation,
                            'surgicalNotes': result.surgicalHistory[i].surgicalNotes,
                            'physicianNotes': result.surgicalHistory[i].physicianNotes,
                            'anaesthesiaNotes': result.surgicalHistory[i].anesthesiaNotes,
                            'consequence': result.surgicalHistory[i].consequence,

                            'id': result.surgicalHistory[i].id
                        });
                    }

                }

            }
        });
    },
    surgicalHistoryadd: function (req, res) {
        var viewModel = {
            doctors: [],
            patientInfo: {},
            dr: {}
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
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('surgicalHistory', viewModel);
                    }
                });
            }
        });
    },
    surgicalHistorysubmit: function (req, res) {
        acc = req.params.patientAccount;
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
                'ethAddr': req.params.patientAccount
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
                        'anesthesiaNotes': req.body.anesthesiaNotes,
                        'consequence': req.body.consequence,
                    }
                }
            }, function (err, result) {
                if (err) throw err;
            }, false, true);
        });

        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    if (err) throw err;
                    else {
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (err, link) {
                            if (link === null) {
                                console.log('newlink');
                                var newLink = new Models.Link({
                                    patient: patient.id,
                                    doctor: doctor.id
                                });
                                newLink.save();
                            } else {
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
                                fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                    for (var i = 0; i < files.length; i++) {
                                        testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                        var testBuffer = new Buffer(testFile);
                                        var filename = files[i];
                                        ipfs.files.add(testBuffer, function (err, output) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            console.log("Files:::", filename);
                                            console.log(output[0].hash);
                                            Models.Link.update({
                                                'patient': patient.id,
                                                'doctor': doctor.id
                                            }, {
                                                $addToSet: {
                                                    'hashes': {
                                                        'linkage': output[0].hash,
                                                        'recordid': filename

                                                    }
                                                }
                                            }, function (err, result) {
                                                if (err) throw err;
                                            }, false, true);


                                        });
                                    }


                                });
                                res.redirect('/doctor/' + doctor.ethAddr);

                            }
                        });
                    }
                });

            }
        });
    },

    reportslist: function (req, res) {
        var viewModel = {
            patientInfo: {},
            dr: {},
        }
        Models.Doctor.findOne({
            'ethAddr': {
                $regex: req.params.drAccount
            }
        }, function (err, doctor) {
            if (err) throw err;
            else {
                viewModel.dr = doctor;
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex: req.params.patientAccount
                    }
                }, function (err, patient) {
                    viewModel.patientInfo = patient;
                    res.render("reportslist", viewModel);
                });
            }
        });
    },
    reportsdetailsview: function (req, res) {

        Models.Patient.findOne({
            'ethAddr': {
                $regex: req.params.patientAccount
            }
        }, function (err, result) {
            if (err) throw err;
            else {
                for (i = 0; i < result.reports.length; i++) {
                    if (result.reports[i].id === req.params.dataid) {

                        res.send({
                            'title': result.reports[i].title,
                            'description': result.reports[i].description,
                            'filename': result.reports[i].filename,
                            'docEdited': result.reports[i].docEdited,
                            'id': result.reports[i].id
                        });
                    }

                }

            }
        });
    },
    reportsadd: function (req, res) {
        var viewModel = {
            doctors: [],
            patientInfo: {},
            dr: {}
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
            'ethAddr': req.params.patientAccount
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (!err && patient) {
                viewModel.patientInfo = patient;
                Models.Doctor.findOne({
                    'ethAddr': req.params.drAccount
                }, function (err, doctor) {
                    if (err) {
                        throw err;
                    }
                    if (!err && doctor) {
                        viewModel.dr = doctor;
                        res.render('reports', viewModel);
                    }
                });
            }
        });
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
            Models.Doctor.findOne({
                'ethAddr': {
                    $regex: req.params.drAccount
                }
            }, function (err, doctor) {
                if (err) throw err;
                else {
                    Models.Patient.findOne({
                        'ethAddr': {
                            $regex: req.params.patientAccount
                        }
                    }, function (err, patient) {
                        if (err) throw err;
                        else {
                            Models.Link.findOne({
                                'patient': patient.id,
                                'doctor': doctor.id
                            }, function (err, link) {
                                if (link === null) {
                                    console.log('newlink');
                                    var newLink = new Models.Link({
                                        patient: patient.id,
                                        doctor: doctor.id
                                    });
                                    newLink.save();
                                } else {
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
                                    fs.readdir("./public/upload/patients/" + acc + "/", (err, files) => {

                                        for (var i = 0; i < files.length; i++) {
                                            testFile = fs.readFileSync("./public/upload/patients/" + acc + "/" + files[i]);
                                            var testBuffer = new Buffer(testFile);
                                            var filename = files[i];
                                            ipfs.files.add(testBuffer, function (err, output) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log("Files:::", filename);
                                                console.log(output[0].hash);
                                                Models.Link.update({
                                                    'patient': patient.id,
                                                    'doctor': doctor.id
                                                }, {
                                                    $addToSet: {
                                                        'hashes': {
                                                            'linkage': output[0].hash,
                                                            'recordid': filename

                                                        }
                                                    }
                                                }, function (err, result) {
                                                    if (err) throw err;
                                                }, false, true);


                                            });
                                        }


                                    });
                                    res.redirect('/doctor/' + doctor.ethAddr);

                                }
                            });
                        }
                    });

                }
            });
        });
    },
    reportsdownload: function (req, res) {
        pathname = '/upload/patients/' + req.params.patientAccount + '/' + req.params.filename;
        
        var file = path.join(__dirname,'../public');
        filename =path.join(file,pathname);
        console.log(filename);

        res.download(filename, function (err,res) {
            if (err) {
                console.log("Error");
                console.log(err);
                res.send({"msg":"Error downloading file"});

            } else {
                console.log("Success");
            }
        });
        
         
        // res.download(__dirname + '/public/upload/patients/' + req.params.patientAccount + '/' + req.params.filename, 'report.pdf', function (err) {
        //     if (err) {
        //         console.log("File not found");
        //         res.send({
        //             'msg': 'File not found'
        //         });
        //         // Handle error, but keep in mind the response may be partially-sent
        //         // so check res.headersSent
        //     } else {
        //         res.send({
        //             'msg': "Download"
        //         });
        //         // decrement a download credit, etc.
        //     }
        // });
    },
    messagedrsubmit: function(req,res){
        Models.Doctor.findOne({
            'ethAddr': {
                $regex : req.params.drAccount
            }
        }, function (err, doctor){
            if (err) throw err;
            else {
                Models.Patient.findOne({
                    'ethAddr': {
                        $regex : req.params.patientAccount
                    }
                }, function (err, patient){
                    if (err) throw err;
                    else {
                        Models.MessageDr.findOne({
                            'doctor': doctor.id,
                            'patient' : patient.id
                        }, function (err, msg){
                            if (err) throw err;
                            else {
                                if (msg===null){
                                    var newMsg = new Models.MessageDr({
                                        patient: patient.id,
                                        doctor: doctor.id,
                                    });
                                    newMsg.message.text=req.params.msg;
                                    newMsg.save();
                                    
                                }else {
                                    Models.MessageDr.update({
                                        'doctor': doctor.id,
                                        'patient' : patient.id
                                    }, {
                                        $addToSet: {
                                            'message': {
                                                'text': req.params.msg,
                                                'date': Date.now(),
                                                'doctorName': doctor.personalDetail.firstName + " "+doctor.personalDetail.middleName + " "+doctor.personalDetail.lastName 
        
                                            }
                                        }
                    
                                    }, function (err, result) {
                                        if (err) {
                                            throw err;
                                        }
                                        res.send({'message': 'The message has been forwarded to patient.'});
                                    }, false, true);
                                   
                                }
                            }
                        });
                    }
                });
            }
        });
    }


};