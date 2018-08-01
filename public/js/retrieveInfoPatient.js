$(function(){
    $('#patientProfile').hide();
    $('.btn-retrieve-patient').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        $.post ('/doctor/'+ids[1]+'/'+ids[0]+'/getPatientInfo').done(function(data){
            // $('.likes-count').text(data.likes);
            
            $('#blankProfilePatient').hide();
                 
            var imgsrc = '/public/upload/patients/'+data.patient.ethAddr+'/'+data.patient.personalDetail.profilePic;

            $('#patientProfile').show();
            $("#patientName").text(data.patient.personalDetail.firstName+" "+ data.patient.personalDetail.middleName+" "+ data.patient.personalDetail.lastName);
            $("#patientAge").text( "DOB: ",data.patient.personalDetail.dob);
            $("#patientGender").text("Gender: "+ data.patient.personalDetail.gender);
            $("#patientAddress").text(data.patient.personalDetail.address);
            $("#patientContact").text(data.patient.personalDetail.contact);
            // $("#drHospitals").text(data.dr.personalDetail.hospitals);
            // $("#sharebtn").attr('href','/patient/'+ids[1]+'/'+ids[0]+'/sharedoc/info'); 
            $('#patientProImg').attr('src',imgsrc);
            $('#retrievePatient').on('click',function(event){
                
                $.post ('/doctor/'+ids[1]+'/'+data.patient.ethAddr+'/retrieve').done(function(data,count){
                    count=0;
                    for (i = 0; i < data.hash.length; i=i+2) {
                        
                        user.checkperm (data.dr.ethAddr,data.hash[i+1], function(error, result){
                            if (error) throw error;
                            else {
                                if (result == true){
                                   count = count +1;
                                   if(count == data.hash.length/2){
                                        alert ("You have got Permission");
                                        window.location.href =  '/doctor/'+ids[1]+'/'+ids[0]+'/patientInfo';
                                   }
                                }
                                else {
                                    alert ("Sorry, you have no permission to view the profile");
                                   window.location.href  = '/doctor/'+ids[1];
                                }

                            }
                        });    
                        
                    } 
                    
                    
                });

               
            });
        });

        
    });
});