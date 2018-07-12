var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home');
    patient = require('../controllers/patient');
    doctor = require('../controllers/doctor');
module.exports = function (app) {
    router.get('/', home.index);
    router.get('/patient/:firstAccount',patient.index);
    router.get('/doctor/:firstAccount',doctor.index);

    router.post('/home/:firstAccount',home.login);
    router.get('/home/:firstAccount/signuppatient',home.signuppatient);
    router.get('/home/:firstAccount/signupdr',home.signuppatient);
    router.post('/home/:firstAccount/signuppatient/firstform',home.patientfirstform);
    router.post('/home/:firstAccount/signuppatient/secondform',home.patientsecondform);
    router.post('/home/:firstAccount/signuppatient/thirdform',home.patientthirdform);
    
    
    router.get('/patient/:firstAccount/allergies', patient.allergies);
    router.get('/patient/:firstAccount/immunization', patient.immunization);
    router.get('/patient/:firstAccount/vitalSigns', patient.vitalsigns);
    router.post('/patient/:firstAccount/vitalSignssubmit', patient.vitalsignssubmit);
    router.get('/patient/:firstAccount/surgicalHistory', patient.surgicalhistory);
    router.get('/patient/:firstAccount/medications', patient.medications);
    router.get('/patient/:firstAccount/personalDetail', patient.personaldetail);
    router.get('/patient/:firstAccount/reports', patient.reports);
    app.use(router);
};