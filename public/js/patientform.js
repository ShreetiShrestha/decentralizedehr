$(function(){
    $('#checkicon1').hide();
    $('#finish').hide();
    $('#firstform-post').on('click',function(event){
        $('#firstform-post').hide();
        $('#checkicon1').show();
        $('#finish').hide();
    });

    $('#checkicon2').hide();
    $('#secondform-post').on('click',function(event){
        $('#secondform-post').hide();
        $('#checkicon2').show();
    });    
    $('#thirdform-post').on('click',function(event){
        $('#thirdform-post').hide();
        $('#finish').show();
    });    
});