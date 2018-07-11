var web3Module = require('../ethereum/web3'),
    Web3 = require('web3'),
    web3 = web3Module.web3,
    Models = require('../models'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path');
    
module.exports = {
    index: function (req, res) {
        res.render('index');
    },

    login: function (req, res) {
        acc = req.params.firstAccount;
        console.log(req.params.firstAccount);
        Models.Patient.findOne({
            ethAddr: {
                $regex: acc
            }
        }, function (err, patient) {
            if (err) {
                throw err;
            }
            if (patient) {
                console.log('1');
                res.json({
                    msg: 'You have been registered as a patient in our system. Login in to the system?',
                    key: 1
                });
            }
            console.log('2');
            Models.Doctor.findOne({
                ethAddr: {
                    $regex: acc
                }
            }, function (err, doctor) {
                if (err) {
                    throw err;
                }
                if (doctor) {
                    console.log('3');
                    res.json({
                        msg: 'You have been registered as a doctor in our system. Login in to the system?',
                        key: 2
                    });
                }
                console.log('4');
                res.json({
                    msg: 'You have not yet been registered to our system. Would you like to sign up?',
                    key: 3
                });
            });
        });
    },

    signuppatient: function (req, res) {
        console.log(req.params.firstAccount);
        var newPatient = new Models.Patient({
            ethAddr: req.params.firstAccount
        });
        console.log(newPatient);
        var viewModel = {
            patient: req.params.firstAccount
        }
        newPatient.save();
        res.render('registerPatient', viewModel);
    },

    signupdr: function (req, res) {
        console.log(req.params.firstAccount);
        // var viewModel= 
        res.render('registerDoctor');
    },

    patientfirstform: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $set: {
                'username': req.body.username,
                'email': req.body.email
            }
        }, function (err, result) {
            if (err) throw err;
        });
    },

    patientsecondform: function (req, res) {
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $set: {
                'personalDetail.firstName': req.body.firstname,
                'personalDetail.lastName': req.body.lastname,
                'personalDetail.middleName': req.body.middlename,
                'personalDetail.gender': req.body.gender,
                'personalDetail.dob': req.body.dob,
                'personalDetail.address': req.body.address,
                'personalDetail.contact': req.body.contact,

                'personalDetail.bloodGroup': req.body.bloodgroup,
                'personalDetail.emergencyContact': req.body.econtact
            }
        }, function (err, result) {
            if (err) throw err;
        });

    },
    patientthirdform: function (req, res) {
        var saveImage = function () {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = ' ';

            for (var i = 0; i < 6; i++) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            var tempPath = req.file.path,
                ext = path.extname(req.file.originalname).toLowerCase(),
                targetPath = path.resolve('./public/upload/' + imgUrl + ext);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                fs.rename(tempPath, targetPath, function (err) {
                    if (err) {
                        throw err;
                    }
                    Models.Patient.update({
                        'ethAddr': req.params.firstAccount
                    }, {
                        $set: {
                            'personalDetail.profilePic': imgUrl + ext,
                        }
                    }, function (err, result) {
                        if (err) throw err;
                    });
                    var patient = Models.Patient.findOne({
                        'ethAddr': req.params.firstAccount
                    });
                    console.log(patient);
                });
            } else {
                fs.unlink(tempPath, function (err) {
                    if (err) throw err;
                    res.json(500, {
                        error: 'Only image files are allowed.'
                    });
                });
            }
        };
        saveImage();
    }

    // patientfourthform: function(req,res){

    // }




};