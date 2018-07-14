var Models = require('../models');
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
                res.render( 'patientdashboard',viewModel);
            }
        });
    },
    allergies: function(req, res){
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
                res.render( 'allergies',viewModel);
            }
        });
    },
    immunization: function(req, res){
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
                res.render( 'immunization',viewModel);
            }
        });
    },
    vitalsigns: function(req, res){
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
                res.render( 'vitalSigns',viewModel);
            }
        });
    },
    surgicalhistory: function(req, res){
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
                res.render( 'surgicalHistory',viewModel);
            }
        });
    },
    medications: function(req, res){
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
                res.render( 'medications',viewModel);
            }
        });
    },
    personaldetail: function(req, res){
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
                res.render( 'personalDetails',viewModel);
            }
        });
    },
    reports: function(req, res){
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
                res.render( 'reports',viewModel);
            }
        });
    },
    vitalsignssubmit: function(req, res){
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: { 'vitalSign':{
                'name': req.body.name,
                'date': req.body.dateOfNote,
                'status':req.body.status,
                'value':req.body.value,
                'unit': req.body.unit,
                'note': req.body.note
            }}
        }, function (err, result) {
            if (err) throw err;
        },false,true);
        res.redirect('/patient/'+ req.params.firstAccount);
    },
    allergiessubmit: function(req, res){
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: { 'allergies':{
                'name': req.body.name,
                'reaction': req.body.reaction,
                'allergenType':req.body.allergentype,
                'severity':req.body.severity,
                'firstObserved': req.body.firstobserved,
                'currentlyActive': req.body.iCheck,
                'note': req.body.note
            }}
        }, function (err, result) {
            if (err) throw err;
        },false,true);
        res.redirect('/patient/'+ req.params.firstAccount);
    },
    immunizationsubmit: function(req, res){
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $addToSet: { 'immunization':{
                'name': req.body.name,
                'type': req.body.type,
                'givenBy':req.body.givenBy,
                'dose':req.body.dose,
                'date': req.body.date,
                'note': req.body.note
            }}
        }, function (err, result) {
            if (err) throw err;
        },false,true);
        res.redirect('/patient/'+ req.params.firstAccount);
    },
    // surgicalhistorysubmit: function(req, res){
    //     Models.Patient.update({
    //         'ethAddr': req.params.firstAccount
    //     }, {
    //         $addToSet: { 'immunization':{
    //             'name': req.body.name,
    //             'type': req.body.type,
    //             'givenBy':req.body.givenBy,
    //             'dose':req.body.dose,
    //             'date': req.body.date,
    //             'note': req.body.note
    //         }}
    //     }, function (err, result) {
    //         if (err) throw err;
    //     },false,true);
    //     res.redirect('/patient/'+ req.params.firstAccount);
    // },
    personalDetailedit: function(req, res){
        Models.Patient.update({
            'ethAddr': req.params.firstAccount
        }, {
            $set: { 'personalDetail':{
                'firstName': req.body.firstname,
                'middleName': req.body.middlename,
                'lastName':req.body.lastname,
                'gender':req.body.gender,
                'dob': req.body.dob,
                'address': req.body.address,
                'contact': req.body.contact,
                'bloodGroup': req.body.bloodgroup,
                'emergencyContact':req.body.econtact,
                // 'profilePic':req.body.dose
            }}
        }, function (err, result) {
            if (err) throw err;
        },false,true);
        res.redirect('/patient/'+ req.params.firstAccount);
    },
}