var Models = require('../models');
module.exports ={
    index: function(req,res){
        Models.Doctor.count({}, function( err, count){
            console.log( "Number of doctors:", count );
            if (count<=3){
                res.send('ya dr ko dashboard hunexa');
            }
            else{
                res.send('ya voting ko status dekhaune page hunexa');
            }
        })
        // if (Models.Doctor.count() < 3){
        //     res.send('ya dr ko dashboard hunexa');
        // }
        // else {
        //     res.send('ya voting ko status dekhaune page hunexa');
        // }
        // // console.log("Counting dr:",Models.Doctor.count());
        
    }
};