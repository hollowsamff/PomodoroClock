$("document").ready(function() {
   
  var minSession = "";
  var minBreak = ""; 

  //Used to reset the timers, i,e when the timers end the function is used to run the Pomodoro Clock more than once
  function resetTimer(){
    minSession = $("#sessionLength").html()-1;
    minBreak = $("#breakLength").html()-1;
  }
  //Lenth of time user has worked and breaks in one session
  var TotalWorked = 0;
  var TotalBreaks = 0; 
  //Show how long a user has been working in one session in hours
  var totalBreakHours = 0;
  var totalWorkedHours= 0;    
  //Used to switch between the break and work timers
  var timerType = "session";
  //Used to count seconds in timer
  var seconds =59;
  //Used to start the findTime fuction 
  var time;
  //Used to start the frame fuction - function that changes the color of the timer box
  var timerColor;  
  //Height of timer box - will slowly change color as the timer decreases
  var height = 0;  
  //Backgound changes every 30 secs
  var myVar = setInterval(function(){ setColor() }, 30000);
  
///////////////////////////////////////////////////////////////Reset everyting, i.e when the reset button is press 
function resetEverthing(){  
  seconds = 59;
  $("#clockHolder").html($("#sessionLength").html()+":00");  
  $("#startStop").html("Start");
  clearInterval(time);
  clearInterval(timerColor);
  $("#sessionLengthMinus,#sessionLengthPluss,#breakLengthMinus,#breakLengthPluss").prop('disabled', false);
  timerType ="session";
  $("#workType").html("<p>Work Session<p>"); 
  TotalWorked = TotalBreaks = totalBreakHours = totalWorkedHours = height = 0;
  $("#totalWork").html(""); 
}
resetEverthing();
/////////////////////////////////////////////////////////////////Found code on https://www.w3schools.com
function setColor() {
  var x = document.body;
  x.style.backgroundColor = x.style.backgroundColor == "lightgreen" ? "lightyellow" : "lightgreen";
}
////////////////////////////////////////////////////////////////
$("button").on("click",function(e){
  e.preventDefault();
  var id = this.id;
  
  switch(id){
    case "reset":
      resetEverthing();  
    break;    
    case "startStop":   
      if($("#"+id).html() == "Start"){//Start timer
        $("#"+id).html("Stop");
        //Stop user changeing timer length values when timer is runing
        $("#sessionLengthMinus,#sessionLengthPluss,#breakLengthMinus,#breakLengthPluss").prop('disabled', true);
        time = setInterval(function(){ findTime() }, 1000);    
        timerColor = setInterval(function(){ frame() }, 1000);
        resetTimer();    
      }else{//Pause timer
        $("#"+id).html("Start");
        $("#sessionLengthMinus,#sessionLengthPluss,#breakLengthMinus,#breakLengthPluss").prop('disabled', false);
        clearInterval(time);
        clearInterval(timerColor);  
      }
    break;
    case "sessionLengthMinus"://Change break length
    case "sessionLengthPluss": 
        minSession =  Number($("#sessionLength").html());
        if(id == "sessionLengthMinus"){
          if(minSession > 1){
            minSession =  Number($("#sessionLength").html())-1;
          }
         }else{
            minSession =  Number($("#sessionLength").html())+1;
         }
        //Update clock face
        if( timerType == "session"){
           $("#clockHolder").html(minSession+":00");
        }
        $("#sessionLength").text(minSession);
     break;
     case "breakLengthMinus":
     case "breakLengthPluss":
       minBreak = Number($("#breakLength").html());
      if(minBreak  > 0){
        if(id == "breakLengthMinus"){
          if(minBreak > 1){
            minBreak = Number($("#breakLength").html())-1;
          }
        }else{
          minBreak = Number($("#breakLength").html())+1;
        }
        //Update clock face
        if( timerType == "break"){
          $("#clockHolder").html(minBreak+":00");
        }
        $("#breakLength").text(minBreak); 
       }
     break; 
  }//End switch
});   
  
/////////////////////////////////////////////Used to create a progress bar for the timer - the background color of the bar will be differnt for a work sesson and break timers 
  function frame() {
    //Change background color of the bar
    if(timerType == "session"){
      $(".myBar").css("background-color","green"); 
    }else if(timerType == "break"){ 
     $(".myBar").css("background-color","red");  
    } 
    //Change height of bar - bar cannot be bigger than the height of the clockHolder box(5 is subtact from clockHolder height to fix display issues)
    if (height == 95) {
      height = 0;         
    }else{      
      height++;     
      $(".myBar").css("height",height+"%");    
    }
  }    

////////////////////////////////////////////
  
function findTime(){
  
  if(seconds < 10){ 
    seconds = "0"+seconds;
  }
  if(timerType == "session"){
    $("#clockHolder").html("<div class='myBar'><p style='padding-top','35px'>"+minSession+":"+seconds+"</p></div>");  
  }else{
    $("#clockHolder").html("<div class='myBar'><p style='padding-top','35px'>"+minBreak+":"+seconds+"</p></div>");   
  } 
  seconds --;
  if(seconds <= -1) {
    
      if(timerType == "session"){  
        minSession --;     
      }else if(timerType == "break"){     
        minBreak--;      
      }
      seconds = 59;
    
      if(minSession == -1 || minBreak == -1 ){ 

          height = 0;//Height of timer box       
          $(".myBar").css("height",height+"%") 
          //Play sound when timer ends
          $('#audio').html('<audio autoplay><source src="http://samfranciswebdeveloper-com.stackstaging.com/sound/alert.mp3"></audio>');

          if(timerType =="session"){
            timerType ="break";
            $("#workType").html("<p>Break<p>");          
            TotalWorked += Number($("#sessionLength").html()); 
            
          }else if(timerType =="break"){     
            timerType ="session";      
            TotalBreaks += Number($("#breakLength").html());            
          }
             
         if(TotalWorked >= 59){
          totalWorkedHours++;
          TotalWorked -= 59;
         }
         if(TotalBreaks >= 59){
          totalBreakHours++;
          TotalBreaks -= 59;
         }
        
        //Show how long a user has been working in one session      
        $("#totalWork").html("<p>You have worked for "+totalWorkedHours+" hours, "+TotalWorked+ " minutes <br>and had "+totalBreakHours+" hours, "+TotalBreaks+" minutes of breaks</p>");          
                     
        //Reset the timers after they have ended
        resetTimer();
        //Remove resetTimer(); and uncomment this code to only run the timers once 
        //if(minSession == -1 && minBreak == -1 ){
          //clearInterval(timerColor);
          //clearInterval(time);
        //}   
      }    
  }
  
}

});