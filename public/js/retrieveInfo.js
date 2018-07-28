$(function(){
    $('#drProfile').hide();
    $('#btn-retrieve').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        $.post ('/patient/'+ids[1]+'/'+ids[0]+'/sharedoc').done(function(data){
            // $('.likes-count').text(data.likes);
            
            $('#blankProfile').hide();
                 
            var imgsrc = '/public/upload/doctors/'+data.dr.ethAddr+'/'+data.dr.personalDetail.profilePic;

            $('#drProfile').show();
            $("#drName").text(data.dr.personalDetail.firstName+" "+ data.dr.personalDetail.middleName+" "+ data.dr.personalDetail.lastName);
            $("#drSpecialization").text( data.dr.personalDetail.specializationDesc);
            $("#drNMC").text("NMC Registration No: "+ data.dr.personalDetail.nmc);
            $("#drAddress").text(data.dr.personalDetail.address);
            $("#drContact").text(data.dr.personalDetail.contact);
            $("#drHospitals").text(data.dr.personalDetail.hospitals);
            $("#sharebtn").attr('href','/patient/'+ids[1]+'/'+ids[0]+'/sharedoc/info'); 
            $('#drProImg').attr('src',imgsrc);
        });

        
    });
});