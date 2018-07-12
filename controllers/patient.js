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
            $set: {
                'vitalSign.name': req.body.name,
                'vitalSign.date': req.body.date,
                'vitalSign.status': req.body.status,
                'vitalSign.value': req.body.value,
                'vitalSign.unit': req.body.unit,
                'vitalSign.notes': req.body.notes
            }
        }, function (err, result) {
            if (err) throw err;
        });

    }
}