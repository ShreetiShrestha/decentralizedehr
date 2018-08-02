$(function(){
    $("#addMsgDr").on('click', function(event){
        var ids = $(this).data('id');
        ids=ids.split(' ');
        var msgToPatient = prompt("Enter the message/instructions for the patient:");
        $.post ('/doctor/'+ids[0]+'/'+ids[1]+'/messagebydr/'+msgToPatient).done(function(data){
            alert (data.message);          
        });
    });
});