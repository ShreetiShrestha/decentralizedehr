var Models = require('../models');
module.exports = {
    index: function (req, res) {
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
    res.render('patientdashboard');
    }
}