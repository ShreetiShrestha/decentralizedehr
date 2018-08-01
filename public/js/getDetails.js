$(function(){
    $('#vitalSignDetail').hide();
    $('.viewVitalSign').on('click', function (event){
        event.preventDefault();
        $("#vitalSignBlank").hide();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        
       
        $.post ('/doctor/'+ids[1]+'/'+ids[0]+'/vitalSignDetailView/'+ids[2]).done(function(data){
            $('#vitalSignDetail').show();
            $("#VSName").text(data.name);
            $("#VSDate").text( "Date of Note : "+data.dateOfNote);
            $("#VSStatus").text("Status : "+ data.status);
            $("#VSVal").text(data.value);
            $("#VSUnit").text(data.unit);
            $("#VSNotes").text(data.notes);
           
           
        });
        

    });

    $(".loadingSpinner").hide();
    $('.submitByDr').on('click', function (event){
        var id = $(this).data('id');
        
        $(".submitByDr").hide();
        $(".loadingSpinner").show().delay(5000).fadeOut(0);
            
      
        

    });
    
});