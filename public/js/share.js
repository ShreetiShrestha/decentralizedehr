$(function(){
    $('#sharebtn').on('click',function(event){
        var ids = $(this).data('id');
        ids=ids.split(' ');
        

        $.post ('/patient/'+ids[0]+'/'+ids[1]+'/sharedoc/info').done(function(data){
            alert(data.msg);
        });
    });
});