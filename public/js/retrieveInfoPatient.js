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
        });

        
    });
});