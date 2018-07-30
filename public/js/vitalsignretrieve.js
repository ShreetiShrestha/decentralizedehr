$(function(){
    $('#vitalSigns').hide();
    $('.btn-retrieve').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        $.post ('/patient/'+ids+'/vitalSignsDetails').done(function(data){
            // $('.likes-count').text(data.likes);
            
            $('#blankProfile').hide();

            $('#vitalSigns').show();
            $("#vname").text(data.patient.vitalSign.name);
            $("#vdate").text( data.patient.vitalSign.dateOfNote);
            $("#vvalue").text("Value: "+ data.patient.vitalSign.value);
            $("#vstatus").text(data.patient.vitalSign.status);
            $("#vnotes").text(data.patient.vitalSign.notes);
        });

        
    });
});