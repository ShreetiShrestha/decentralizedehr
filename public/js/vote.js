$(function(){
    $('.button-vote').on('click',function(event){
        event.preventDefault();
        var candidate = $(this).data('id');
        
        $.post ('/doctor/'+candidate+'/vote').done(function(data){
            alert(data.msg)          
        });
        
    });
});