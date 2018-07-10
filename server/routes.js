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
    // router.post('/home/:firstAccount/signuppatient/thirdform',home.patientthirdform);
    // router.post('/home/:firstAccount/signuppatient/fourthform',home.patientfourthform);
    router.get('/home/:firstAccount/signupdr',home.signuppatient);
    router.get('/patient/:firstAccount',patient.index);
    router.get('/doctor/:firstAccount',doctor.index);
    
    // router.get('/images/:image_id', image.index);
    // router.post('/images', image.create);
    // router.post('/images/:image_id/like', image.like);
    // router.post('/images/:image_id/comment', image.comment);
    // router.delete('/images/:image_id', image.remove);
    app.use(router);
};