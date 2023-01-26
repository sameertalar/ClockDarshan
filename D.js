$(document).ready(function () {
  
    var __AppEnabledStatus = false;
    const _StatsSheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4af-A_QOdSBICCNcznq2FtDh4dO-rY92L9wuq26XjHIYRWJ8ZCFyktgjtJqPB429xQMMOVcO23xVl/pubhtml?gid=1210536617&amp;single=true&amp;widget=true&amp;headers=false";

  page_Load();



  __AppEnabledStatus = setInterval(processBeHereNow, 1000);
  function page_Load() {

    $("#success-alert").hide();

  }

  function processBeHereNow() {
    try {
      let now = new Date();
      let hours = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();
      let ms = now.getMilliseconds() / 1000;

      // show Current Time
      showCurrentTimeLeft(hours, min, sec);
      showTimeElaspeProgress(min, sec);

    } catch (error) {
        console.log("Unhandled Error", error);
        $("#errorMessage").html("Unhandled Error: " + error);
      }
    }

    function showTimeElaspeProgress(min, sec) {
    
        let elaspePercentQ = ((min % 15) * 60 + sec) / 9;
        $("#quarterStatus").width(elaspePercentQ + "%");
      }  

  function showCurrentTimeLeft(hours, min, sec) {
    //var timeNow =  (hrs === 0 ? "12" : pad(hrs, 2)) +   ":" +      pad(min, 2) + ":" + pad(sec, 2)  +            " "     +            (hours > 12 ? "PM" : "AM");
    
    var timeNow = pad(14 - (min % 15), 2) + ":" + pad(60 - sec, 2);
    //var timeNow = pad(min % 15, 2) + ":" + pad(sec, 2);

    $("#timeLeft").text(timeNow);
  }

  function setTrackerTime() {
    $("#selectTrackerTime").val(getCurrentTrackerTimeRow());
  }

  // ******* TIME Functions *******

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }

  // End of Code

});
