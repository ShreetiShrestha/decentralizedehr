$(function(){
    $('.button-vote').on('click',function(event){
        event.preventDefault();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        $.post ('/doctor/'+ids[1]+'/'+ids[0]+'/vote').done(function(data){
            alert (data.msg);
            window.location.href = '/doctor/' + ids[1];
        });
        
    });
});