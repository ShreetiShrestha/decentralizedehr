var Models = require('../models');
module.exports = {
    index: function (req, res) {
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
            Models.Doctor.findOne({
                ethAddr: {
                    $regex: req.params.firstAccount
                }
            }, function (err, doctor) {
                validity = doctor.validDoc;
                console.log(doctor.validDoc);
                if (validity === true) {
                    res.send('ya dr ko dashboard hunexa');
                } else {
                    res.send('ya voting ko status dekhaune page hunexa');
                }
            });
        });


    }
};