var Models = require('../models');
module.exports ={
    index: function(req,res){
        console.log(Models.Doctor.count());
        res.send('ya dr ko dashboard hunexa');
    }
};