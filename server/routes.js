var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home');
    patient = require('../controllers/patient');
    doctor = require('../controllers/doctor');
module.exports = function (app) {
    router.get('/', home.index);

    router.post('/home/:firstAccount',home.login);
    router.get('/home/:firstAccount/signup',home.signup);
    router.post('/patient/:firstAccount',patient.index);
    router.post('/doctor/:firstAccount',doctor.index);
    
    // router.get('/images/:image_id', image.index);
    // router.post('/images', image.create);
    // router.post('/images/:image_id/like', image.like);
    // router.post('/images/:image_id/comment', image.comment);
    // router.delete('/images/:image_id', image.remove);
    app.use(router);
};