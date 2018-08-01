$(function(){
    $('#Loading').show().delay(28999).hide(0);

    $('#recordCall').hide().delay(29000).show(0);
    $('#recordCall').on('click',function(event){
        var ids = $(this).data('id');
        ids=ids.split(' ');
        
        $.post ('/patient/'+ids[0]+'/'+ids[1]+'/blockchain').done(function(data){
            
            for (i = 0; i < data.hash.length; i=i+2) {
                alert("Please accept the transaction to Metamask for uploads and permissions");
                user.addRecord(data.hash[i+1],data.hash[i],function(err,res){
                    if (err)throw err;
                    else{
                    console.log("Record Added");               
                
                }
                }); 
              
                user.setPermission (data.dr.ethAddr,data.hash[i+1], function(error, result){
                    if (error) throw error;
                    else {
                        console.log ("Permission set");
                    }
                });      
                
                
            } 
            window.location.href = '/patient/' + data.patient.ethAddr;
        });
    });
});