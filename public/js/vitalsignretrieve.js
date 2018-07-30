$(function(){
    $('#vitalSigns').hide();
    $('.btn-retrieve-vital').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        
        $.post ('/patient/'+ids[1]+'/vitalSignsDetails/'+ids[0]).done(function(data){
            // $('.likes-count').text(data.likes);
            
            $('#blankProfileVital').hide();

            $('#vitalSigns').show();
            alert( data.patient.vitalSign[0].name);
            $("#vName").text("Test of: "+data.patient.vitalSign[0].name);
            $("#vDate").text( "Date: "+data.patient.vitalSign[0].dateOfNote);
            $("#vvalue").text("Value: "+ data.patient.vitalSign[0].value +' '+data.patient.vitalSign[0].unit);
            $("#vstatus").text(data.patient.vitalSign[0].status);
            $("#vnotes").text(data.patient.vitalSign[0].notes);
        });

        
    });
});