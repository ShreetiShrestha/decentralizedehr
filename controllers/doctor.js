var Models = require('../models');
module.exports = {
    index: function (req, res) {
        var viewModel = {
            dr: {},
            validationList: [],
            countlist: {},
            linkslist: []
        };


        Models.Doctor.count({}, function (err, count) {
            console.log("Number of doctors:", count);

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
                        console.log(viewModel.validationList);
                    }
                }
            });
            Models.Doctor.findOne({
                ethAddr: {
                    $regex: req.params.firstAccount
                }
            }, function (err, doctor) {
                validity = doctor.validDoc;
                console.log(doctor.validDoc);
                viewModel.dr = doctor;
                viewModel.countlist.myCount = doctor.voteCount;
                if (validity === true) {
                    Models.Link.find({
                        'doctor':doctor.id
                    },function(err,links){
                        if (err)throw err;
                        else{
                            for (var i=0;i<links.length;i++){
                                Models.Patient.findOne({
                                    _id : links[i].patient
                                },function(err,patient){
                                    if (err){
                                        console.log('No patient links found');
                                        throw err;
                                    } 
                                    else{
                                        console.log(patient);
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
                        console.log("No of valid dr:", count);
                        viewModel.countlist.dr = count;
                        viewModel.countlist.threshold = threshold;
                        viewModel.countlist.needed = threshold - viewModel.countlist.myCount + 1;
                        Models.Patient.count({}, function (err, countPatient) {
                            viewModel.countlist.patients=countPatient;
                            viewModel.countlist.total = countPatient +viewModel.countlist.dr;
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
                console.log(doctor);
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
                    console.log("No of valid dr:", count);
                    console.log("Threshold value:", threshold);
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
    retrieve : function(req,res){
        var viewModel= {
            patientInfo:{},
            dr: {},
            hash:[]
        }

        Models.Patient.findOne({
            'ethAddr':{
                $regex: req.params.patientAccount
            } 
        }, function(err, patient){
            if (err) throw err;
            else{
                viewModel.patientInfo=patient;
                Models.Doctor.findOne ({
                    'ethAddr':{
                        $regex: req.params.drAccount
                    }
                }, function (error, doctor){
                    if (error) throw error;
                    else {
                        viewModel.dr = doctor;
                        Models.Link.findOne({
                            'patient': patient.id,
                            'doctor': doctor.id
                        }, function (er, link){
                            if (er) throw er;
                            else{
                                console.log(link);
                                for (i=0; i<link.hashes.length; i++){
                                    console.log("Link",link.hashes[i].linkage);
                                    viewModel.hash.push(link.hashes[i].linkage);
                                    viewModel.hash.push(link.hashes[i].recordid);
                                }
                                console.log(viewModel);
                                res.send(viewModel);
                            }
                        })
                    }
                })
            }
        })
        
    },
    patientInfo : function(req,res){
        res.render('patientRetrieveInfo');
    }
};