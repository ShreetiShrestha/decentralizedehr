$(function () {
       
    $('#finishPatient').on('click', function (event) {
        var id = $(this).data('id');
        user.addPatient(function(err,result){
            if (err) throw err;
            else {
            console.log('done');
            alert("You have been registered as patient in the system");}
            });
        
    });   
    $('#finishDr').on('click', function (event) {
        var id = $(this).data('id');
        user.addHCP(id,function(err,result){
            if (err) throw err;
            else {
            console.log('done');
            alert("You have been registered as dr in the system");}
            });
        
    }); 
});