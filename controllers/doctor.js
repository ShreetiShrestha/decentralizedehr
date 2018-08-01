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
        acc= req.params.patientAccount;
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
        acc= req.params.patientAccount;
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
};