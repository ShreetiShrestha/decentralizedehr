$(function(){
    $('#drProfile').hide();
    $('#btn-retrieve').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        $.post ('/patient/'+ids[1]+'/'+ids[0]+'/sharedoc').done(function(data){
            // $('.likes-count').text(data.likes);
            $('#blankProfile').hide();
            // alert(data.dr.ethAddr); 
            $('#drProfile').show();
            $("#drName").text(data.dr.personalDetail.firstName+" "+ data.dr.personalDetail.lastName)
            $('#drProImg').attr('src','/public/upload/doctors/'+data.dr.ethAddr+'/'+dr.personalDetail.profilePic);
          $('#drProfile').show();
           
        });

        
    });
});