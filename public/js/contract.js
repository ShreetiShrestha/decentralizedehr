$(function () {
       
    $('#finishPatient').on('click', function (event) {
        var id = $(this).data('id');
        alert("Make sure you check Metamask notifications and accept the transaction");
        user.addPatient(function(err,result){
            if (err) throw err;
            else {
            console.log('done');
           }
            });

        
    });   
    $('#finishDr').on('click', function (event) {
        var id = $(this).data('id');
        alert("Make sure you check Metamask notifications and accept the transaction");
        user.addHCP(id,function(err,result){
            if (err) throw err;
            else {
            console.log('done');
            alert("You have been registered as dr in the system");}
            });
        
    }); 
});