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
    $('#allergyDetail').hide();
    $('.viewAllergy').on('click', function (event){
        event.preventDefault();
        $("#allergyBlank").hide();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        
       
        $.post ('/doctor/'+ids[1]+'/'+ids[0]+'/allergiesDetailView/'+ids[2]).done(function(data){
            $('#allergyDetail').show();
            $("#AName").text("Allergen :" +data.name);
            $("#AType").text( "Allergen Type : "+data.allergenType);
            $("#AReaction").text("Reaction : "+ data.reaction);
            $("#ASeverity").text("Severity : "+data.severity);
            $("#AFirst").text("First Observed(approx.) : "+data.firstObserved);
            $("#AActive").text("Currently Active : "+data.currentlyActive);
            $("#ANotes").text("Notes : "+data.note);
           
        });
        

    });

    $('#medicationDetail').hide();
    $('.viewMedication').on('click', function (event){
        event.preventDefault();
        $("#medicationBlank").hide();
        var ids = $(this).data('id');
        ids=ids.split(' ');
        
       
        $.post ('/doctor/'+ids[1]+'/'+ids[0]+'/medicationsDetailView/'+ids[2]).done(function(data){
            $('#medicationDetail').show();
            $("#MName").text("Medicine Name :" +data.name);
            $("#MType").text( "Medicine Type : "+data.medicationType);
            $("#MPrescribed").text("Prescribed By : "+ data.prescribedBy);
            $("#MDose").text("Dosage : "+data.dose);
            $("#MFreq").text("Frequency : "+data.frequency);
            $("#MTime").text("Time : "+data.time);
            $("#MStrength").text("Strength : "+data.strength);
            $("#MInstructions").text("Instructions : "+data.instructions);
            $("#MReasons").text("Reasons : "+data.reasonsForTaking);
            $("#MSDate").text("Starting Date : "+data.startDate);
            $("#MEDate").text("Ending Date : "+data.endDate);
            $("#MCurrent").text("Currently Taking : "+data.currentlyTaking);
            $("#MNotes").text("Notes : "+data.notes);
           
        });
        

    });
    $(".loadingSpinner").hide();
    $('.submitByDr').on('click', function (event){
        var id = $(this).data('id');
        
        $(".submitByDr").hide();
        $(".loadingSpinner").show().delay(5000).fadeOut(0);
            
      
        

    });
    
});