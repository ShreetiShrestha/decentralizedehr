var web3Module = require ('../ethereum/web3');
var Web3 = require('web3');
var web3= web3Module.web3;
var Models = require('../models');
module.exports ={
    index: function (req, res){
        res.render ('index'); 
    },
   
    login: function (req,res){
        acc=req.params.firstAccount;
        console.log(req.params.firstAccount);
        Models.Patient.findOne({ethAddr: { $regex : acc}},function(err, patient){
            if (err) {
                throw err;
            }
            if (patient){
                console.log('1');
                res.json({msg:'You have been registered as a patient in our system. Login in to the system?',key:1});
            } 
            console.log('2');
            Models.Doctor.findOne({ethAddr: { $regex : acc}},function(err, doctor){
                if (err) {
                    throw err;
                }
                if (doctor){
                    console.log('3');
                    res.json({msg:'You have been registered as a doctor in our system. Login in to the system?',key:2});
                } 
                console.log('4');
                res.json({msg:'You have not yet been registered to our system. Would you like to sign up?',key:3});
            });
        });
    },

    signuppatient: function (req,res){
        console.log (req.params.firstAccount);
        var newPatient = new Models.Patient({ethAddr:req.params.firstAccount});
        console.log(newPatient);
        var viewModel = {
            patient: req.params.firstAccount
        }
        // newPatient.save();
        res.render('registerPatient',viewModel);
        // Models.Patient.findOne({ ethAddr: { $regex :req.params.firstAccount}}, function(err,patient){
        //     if (err){throw err;}
        //     if (patient){
        //         console.log('m here');
        //         viewModel.patient=patient;
        //         console.log (viewModel.patient);
        //         res.render('registerPatient', viewModel);  
        //     }
        //     console.log('m222 here');
        // });
        // res.render('registerPatient');
    },
    signupdr: function (req,res){
        console.log (req.params.firstAccount);
        // var viewModel= 
        res.render('registerDoctor');
    },
    patientfirstform: function(req,res){
        Models.Patient.findOne({ethAddr: req.params.firstAccount}, function(err){
            if(err){throw err;}
            var newCredentials = new Models.Patient({
                username: req.body.username,
                email: req.body.email
            });
            newCredentials.save();
        });
    },
    patientsecondform: function(req,res){
        Models.Patient.findOne({ethAddr: req.params.firstAccount}, function(err){
            if(err){throw err;}
            var newPersonalDetail = new Models.Patient({
                personalDetail:{
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    middleName: req.body.middlename,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    address: req.body.address,
                    contact: req.body.contact,
                    bloodGroup: req.body.bloodgroup,
                    emergencyContact: req.body.econtact
                }
            });
            newPersonalDetail.save();
        });  
        console.log(req.body.firstname);
    }


    
};