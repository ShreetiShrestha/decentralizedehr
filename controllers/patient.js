var Models = require('../models');
module.exports = {
    index: function (req, res) {
<<<<<<< HEAD
    //     var viewModel = {
    //         patient: {}
    //     };
    //     Models.Patient.findOne({
    //         'ethAddr': req.params.firstAccount
    //     }, function (err, patient) {
    //         if (err) {
    //             throw err;
    //         }
    //         if (!err && patient) {
    //             viewModel.patient = patient;

    //             console.log(viewModel.patient.personalDetail.profilePic);
    //             res.render(viewModel, {
    //                 title: 'patientdashboard',
    //                 layout: 'base'
    //             });
    //         }
    //     });
    // }
    
    res.render('patientdashboard', {
                        title: 'patientdashboard',
                        layout: 'base'
                    });
=======
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
                console.log(viewModel.patient.personalDetail.profilePic);
                res.render( 'patientdashboard',viewModel);
            }
        });
>>>>>>> 7f97328f519521f134047d4589b05e97f3dd6231
    }
}