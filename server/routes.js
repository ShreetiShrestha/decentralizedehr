var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home');
    patient = require('../controllers/patient');
    doctor = require('../controllers/doctor');
module.exports = function (app) {
    router.get('/', home.index);

    router.post('/home/:firstAccount',home.login);
    router.get('/home/:firstAccount/signuppatient',home.signuppatient);
    router.post('/home/:firstAccount/signuppatient/firstform',home.patientfirstform);
    router.post('/home/:firstAccount/signuppatient/secondform',home.patientsecondform);
    router.post('/home/:firstAccount/signuppatient/thirdform',home.patientthirdform);
    router.get('/home/:firstAccount/signupdr',home.signuppatient);
    router.get('/patient/:firstAccount',patient.index);
    router.get('/doctor/:firstAccount',doctor.index);
    app.use(router);
};