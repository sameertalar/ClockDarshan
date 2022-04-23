$(document).ready(function () {
  const MEDIA_ROOT = "../ClockDarshanMedia/";
  var __AppEnabledStatus = false;
  var __ClockdarshanStatus = false;
  var __alertPlayIndicator = 0;
  var __dataConfig;
  const _StatsSheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4af-A_QOdSBICCNcznq2FtDh4dO-rY92L9wuq26XjHIYRWJ8ZCFyktgjtJqPB429xQMMOVcO23xVl/pubhtml?gid=1210536617&amp;single=true&amp;widget=true&amp;headers=false";

  const __Configuration = {
    mind: [
      { title: "Peace", column: "N", icon: "🕊️" },
      { title: "ध्यान", column: "O", icon: "🧘" },
      { title: "अप्रमाद", column: "P", icon: "🧿" },
      { title: "Pramad", column: "Q", icon: "🎳" },
      { title: "Buzzing", column: "R", icon: "🔥" },
    ],
    energy: [
      { title: "High", column: "I", icon: "🔋" },
      { title: "Medium", column: "J", icon: "🥥" },
      { title: "Low", column: "K", icon: "⚪" },
    ],
    work: [
      { title: "Spiritual", column: "C", icon: "🪔" },
      { title: "Value Add", column: "D", icon: "💎" },
      { title: "Health", column: "E", icon: "🌿" },
      { title: "Duty ", column: "F", icon: "👪" },
      { title: "None", column: "G", icon: "🍂" },
    ],
  };

  page_Load();

  // Load
  $("#btnTryChunk").on("click", tryChunkClick);
  //$("#btnTrackerSheetLoader").on("click", loadTrackerSheetFrame);
  $("#btnBatteryLoader").on("click", loadBatteryFrame);
  $("#btnWaveLoader").on("click", loadWaveFrame);
  $("#btnPlayMeditationnAudio").on("click", playMeditationAudio);
  $("#btnPauseMeditationAudio").on("click", pauseMeditationAudio);
  $("#btnPlayVideo").on("click", playVideo);
  $("#onepointer").on("click", oneClickTracker);
  $("#ClockInnerCircle").on("click", oneClickTracker);
  $("#btnResetSheet").on("click", oneClickResetSheet);
  $("#btnPopup").on("click", btnPopupClick);
  $("#btnCounter").on("click", btnCounterClick);
  // $("#btnTracker").on("click", postToGoogle);
  $("#plusQuarter").on("click", plusQuarter);
  $("#minusQuarter").on("click", minusQuarter);
  //  $("#refreshQuarter").on("click", setTrackerTime);
  $("#btnRefresh").on("click", reloadStatusSheet);
  $("#errorMessage").on("click", btnErrorMessageClick);

  $("#radioWorkD").click();
  $("#radioEnergyM").click();
  $("#radioMindA").click();

  $("#selectTrackerTime").focus();

  $("#success-alert").hide();
  postToGoogle(false);

  $("#radioMeditationMusic18").on("change", function (event) {
    musicSelected(this.value);
  });

  $("#radioMeditationMusic20").on("change", function (event) {
    musicSelected(this.value);
  });
  $("#rangeMeditationMusicVolume").on("change", function (event) {
    setMeditationMusicVolume(this.value);
  });

  $(".radioWork").on("change", function (event) {
    $("#centerCoreW").html(
      __Configuration["work"].find(
        (x) => x.column === $(".radioWork:checked").val()
      ).icon
    );
  });
  $(".radioEnergy").on("change", function (event) {
    $("#centerCoreE").html(
      __Configuration["energy"].find(
        (x) => x.column === $(".radioEnergy:checked").val()
      ).icon
    );
  });
  $(".radioMind").on("change", function (event) {
    $("#centerCoreM").html(
      __Configuration["mind"].find(
        (x) => x.column === $(".radioMind:checked").val()
      ).icon
    );
  });

  setMeditationMusicVolume(0.8);

  console.log(
    "%cClock Darshan",
    "font-weight: bold; font-size: 50px; color: #ff4f51; text-shadow: 1px 1px 0px black, 1px -1px 0px black, -1px 1px 0px black, -1px -1px 0px black;"
  );

  // Load End

  // Clock hands position
  __ClockdarshanStatus = setInterval(function () {
    function r(el, deg) {
      el.setAttribute("transform", "rotate(" + deg + " 50 50)");
    }
    var d = new Date();
    let hours =d.getHours();
    let hourDeg = 30 * (hours % 12) + d.getMinutes() / 2;
    let minDeg = 6 * d.getMinutes();

    r(hourHand, hourDeg);
    r(minHand, 6 * d.getMinutes());
    let deg = getOnePointerDegree(hourDeg, minDeg);
      r(onepointerBase, deg);
   

    if ($(".checkEdit:checked").val() != "T") { 
  
      r(onepointerCircle, deg);	
      //console.log(hourDeg,minDeg);
      }
      else{
        let selectedPeriod =parseInt( $("#selectTrackerTime option:selected").val());
        let hour2 = (Math.floor((selectedPeriod-4)  /4)) % 12 || 12;
        let quarter2 = ((selectedPeriod-4)  %4) ;
        let hourDeg2 = 30 * (hour2 % 12);
        let minDeg2 =  quarter2*90;

       
        let deg2 = getOnePointerDegree(hourDeg2, minDeg2);
        r(onepointerCircle, deg2);

      }
  

  //  
 
  }, 1000);

  __AppEnabledStatus = setInterval(processBeHereNow, 1000);

  function page_Load() {
    
    let gods =["गणेश","महाराज","दुर्गा","शंकर","महालक्ष्मी","अन्नपूर्णा","हनुमान","रमण म.","सरस्वती","नर्मदा","बुद्ध","कृष्ण"];
    g =0;
    
    for (let h = 0; h < 24; ++h) {
      for (let q = 1; q <= 4; ++q) {

        $("#selectTrackerTime").append(
          $("<option class='text-primary bg-white'></option>")
            .attr("value", getTrackerRow(h, q))            
            .text((h % 12 || 12).toString().padStart(2, "0") + "-" + q + "")
             .attr("data-row", getTrackerRow(h, q))   
             .attr("data-god", gods[g])       
        );
          
        if(g===11)
        g=0
        else
        g++;
        
      }
    }

    setTrackerTime();
  }

  function getTrackerRow(h, q) {
              return  h * 4 + q + 3;
  }


  function setAlertAudioVolume(value) {
    $("#audioAlert")[0].volume = value;
    $("#rangeAlertAudioVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function getOnePointerDegree(hourDeg, minDeg) {
    let hdeg = 15;
    let hrem = hourDeg % 90;

    let mrem = minDeg % 90;

    if (hrem >= 30) hdeg = 45;
    if (hrem >= 60) hdeg = 75;

    return minDeg - mrem + hdeg;
  }

  function btnCounterClick() {
    let count = parseInt($("#btnCounter").html());
    $("#btnCounter").html(count + 1);
  }
  function btnCounterReset() {
    $("#btnCounter").html(0);
  }

  function tryChunkClick() {
    let now = new Date();
    let min = now.getMinutes();
    let hours = now.getHours();
    playNotification(hours, min - (min % 5), 0, 0);
  }

  function btnPopupClick() {
    var myWindow = window.open(
      window.location.href,
      "",
      "width=400,height=470"
    );
    $("#collapseControlsSettings").collapse("toggle");
  }


  function showCurrentSelection( ) {
    $("#centerCoreD").html(getCurrentTrackerTimeRow() - Number($("#hiddenLoggedRow").val()) );    
    $("#centerCoreG").html($("#selectTrackerTime option:selected").data('god') );     
  }

  function processBeHereNow() {
    try {
      let now = new Date();
      let hours = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();
      let ms = now.getMilliseconds() / 1000;

      // show Current Time
     // showCurrentTime(hours, min, sec);
     showCurrentSelection();

     

      showTimeElaspeProgress(min, sec);

 
      if ($(".checkEdit:checked").val() != "T") {
        setTrackerTime();
 
        if (
          Number($("#hiddenLoggedRow").val())  <  Number($("#selectTrackerTime option:selected").val())
        ) {
          $("body").addClass("bag");
        } else {
          $("body").removeClass("bag");
        }
 

      } else {         

        $("body").removeClass("bag");
      }

      if (min % 5 === 0 && sec === 1) {
        reloadStatusSheet();
        postToGoogle(false);
      }

      if (min % 15 === 0 && sec === 1) {
        //setTrackerTime();
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  function playNotification(hours, minuteChunk, sec, ms) {
    __alertPlayIndicator = minuteChunk * 60 + sec;

    // 1.Before Alert
    playBeforeAlertAudio();
  }
  function playBeforeAlertAudio() {
    let fileName = $("#selectChunkBeforeAlertAudio")
      .find(":selected")
      .data("filename");

    let audioAlert = $("#audioAlert");

    if (fileName) {
      audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
      audioAlert[0].play();
    } else {
      console.log("Audio alert is off. No file selected.");
    }
  }

  function loadTrackerSheetFrame() {
    if ($("#containerTrackerSheet").is(":visible")) {
      $("#frameTrackerSheet").attr("src", "");
      $("#containerTrackerSheet").hide(500);
      reloadStatusSheet();
    } else {
      //const linkMobile = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4af-A_QOdSBICCNcznq2FtDh4dO-rY92L9wuq26XjHIYRWJ8ZCFyktgjtJqPB429xQMMOVcO23xVl/pubhtml?gid=1698318143&single=true";
      const linkDesktop =
        "https://script.google.com/macros/s/AKfycbwI7Arfxt__XVCwjSvtpHUWERtMoU6L7LZMi--ExnMRtyn06sSCz7uJnkgiAXQK_v-x/exec";
      // "https://docs.google.com/spreadsheets/d/1IeLBIUnPFC6-raeOoD1s80C-v8-Sl5rY1p38qFlQ0RY/edit#gid=1698318143";

      //const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

      //sheetLink =isMobile?linkMobile:linkDesktop;

      $("#frameTrackerSheet").attr("src", linkDesktop);

      $("#containerTrackerSheetscroll").height($(window).height() - 20);
      $("#frameTrackerSheet").height($(window).height() - 40);
      $("#containerTrackerSheet").show(500);
      $("#containerTrackerSheetscroll").scrollTop(100);

      // $("#frameStatsSheet").attr("src", "");
      $("#containerStatsSheet").hide(500);
    }
  }

  function toggleStatsSheetFrame() {
    if ($("#containerStatsSheet").is(":visible")) {
      //  $("#frameStatsSheet").attr("src", "");
      $("#containerStatsSheet").hide(500);
    } else {
      reloadStatusSheet();
    }
  }

  function reloadStatusSheet() {
    if ($("#containerWave").is(":visible")) {
      $("#frameStatsSheet").attr("src", "");
      $("#containerStatsSheet").hide(500);
    } else {
      $("#frameStatsSheet").attr("src", _StatsSheetUrl);
      $("#containerStatsSheet").show(500);
    }

  
  }

  function oneClickResetSheet() {}

  function oneClickResetSheet() {
    $("#progress-loading").show();
    $("#success-alert").hide();
    $("#collapseControlsSettings").collapse("toggle");

    let googleapireseturl =
      "https://script.google.com/macros/s/AKfycbzhx9voh2A2FOd-E2hR4-CFinQKV-R0X3CKvheKTBYa/dev?callback=?";

    $.ajax({
      crossOrigin: true,
      url: googleapireseturl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("oneClickResetSheet response data", data);
        //alert('SUCCESS - ' + data)
        showAlert("<h2> Done : " + data + "</h2>");
        $("#progress-loading").hide();
      },
      error: function (xhr, error_text, statusText) {
        //alert('Sheet Reset Done with - ' + error_text)
        console.log("error_text", error_text);
        showAlert("<h2> Reset :" + error_text + "</h2>");
        $("#progress-loading").hide();
      },
    });
  }

  function oneClickTracker() {
    postToGoogle(true);
  }

  function btnErrorMessageClick() { 
    postToGoogle(false);
    reloadStatusSheet();
  }

  function postToGoogle(update) {
    $("#progress-loading").show();
    $("#success-alert").hide();

    let apiurl =
      "https://script.google.com/macros/s/AKfycbxJLoWhDykykVFykQfnvVAwri6wrYwU6xAIrhvOCGOh/dev";
    // Use Dev link no need to publish
    // "https://script.google.com/macros/s/AKfycbyOlFS1KprVp0UFfsfsjs8ibP-LbX4bnmDgKfy4s1qMUbaL6iLr/exec";

    let paramMind = $(".radioMind:checked").val(); // $("#selectMind option:selected").val();
    let paramEnergy = $(".radioEnergy:checked").val();
    let paramWork = $(".radioWork:checked").val();
    //let selectedPeriod = $("#selectTrackerTime option:selected")  .val()      .split("-");
    let selectedPeriod = $("#selectTrackerTime option:selected").val();

    let paramSleep = $(".checkSleep:checked").val();


    let queryString ="?row="+  selectedPeriod;

    if (update) {
      queryString =
       // "?hour=" +        selectedPeriod[0] +        "&quarter=" +        selectedPeriod[1]
       queryString+
        "&work=" +        paramWork +
        "&energy=" +        paramEnergy +
        "&mind=" +        paramMind +
        "&sleep=" +        paramSleep +
        "&callback=?";
    }

    console.log("Api QueryString Request:", queryString);

    let googleurl = apiurl + queryString;

    $.ajax({
      crossOrigin: true,
      url: googleurl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
      
        for (let i = 0; i < data.chunks.length; i++) {

          $("#chunkLablelH"+ (i+1)).html(data.chunks[i].h);
          $("#chunkLablelE"+ (i+1)).html(data.chunks[i].e);
          $("#chunkLablelW"+ (i+1)).html(data.chunks[i].w);
          $("#chunkLablelM"+ (i+1)).html(data.chunks[i].m);
          $("#hiddenTime"+ (i+1)).val(data.chunks[i].ri);

        }        
        // showAlert("Deep Breath");
        //showAlert("<p>" + data + "</p>");
        $("#errorMessage").html(data.lq);
        $("#hiddenLoggedRow").val(data.lr);

        if (update && $(".checkEdit:checked").val() == "T") {

          if(data.lr ===getCurrentTrackerTimeRow())
          {
            $("#checkEdit").prop("checked", false);
          }

        }

        // reloadStatusSheet();
        console.log("Api Response Data:", data);
        $("#progress-loading").hide();
      },
      error: function (xhr, error_text, statusText) {
        showAlert(error_text + "<br> Error while Processing");
        console.log("error_text", error_text);
        $("#progress-loading").hide();
      },
    });
  }

  function setTrackerTime() {

    let now = new Date();
    let h = now.getHours();
    let minutes = now.getMinutes();
    let quarter = 4;

    if (minutes < 45) {
      quarter = 3;
      if (minutes < 30) {
        quarter = 2;
        if (minutes < 15) {
          quarter = 1;
        }
      }
    }

    $("#selectTrackerTime").val(getCurrentTrackerTimeRow());
  }

  function getCurrentTrackerTimeRow() {

    let now = new Date();
    let h = now.getHours();
    let minutes = now.getMinutes();
    let quarter = 4;

    if (minutes < 45) {
      quarter = 3;
      if (minutes < 30) {
        quarter = 2;
        if (minutes < 15) {
          quarter = 1;
        }
      }
    }

    return getTrackerRow(h, quarter);
  }


  
  $("#chunkLablelH1").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH2").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH3").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH4").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH5").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH6").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH7").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH8").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH9").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH10").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH11").on("click", function (event) {
    setTracketSelect(this.id);
  });
  $("#chunkLablelH12").on("click", function (event) {
    setTracketSelect(this.id);
  });

  function setTracketSelect(id) {
    //console.log("Selected", $("#hiddenTime"+id).val());
    $("#selectTrackerTime").val($("#hiddenTime"+id.replace("chunkLablelH","")).val());
    $("#checkEdit").prop("checked", true);
  }
  


 

  function plusQuarter() {
    updownArrow(false) ;
   
  }

  function minusQuarter() {
    updownArrow(true) ;
    $("#radioMindP").click();
 
  }

  function updownArrow(down) {

    $("#checkEdit").prop("checked", true);
    let selectedPeriod =parseInt( $("#selectTrackerTime option:selected").val());
     

    if(down)
    {
      newVal =selectedPeriod-1;   
    }
    else{

      newVal =selectedPeriod+1;    
  
    }	

    $("#selectTrackerTime").val(newVal);

   
  }


  function showAlert(text) {
    $("#alertMessage").html(text);
    $("#success-alert")
      .fadeTo(2000, 1500)
      .slideUp(15000, function () {
        $("#success-alert").slideUp(15000);
      });
  }

  function loadBatteryFrame() {
    if ($("#containerBattery").is(":visible")) {
      $("#frameBattery").attr("src", "");
      $("#containerBattery").hide(500);
    } else {
      $("#frameBattery").attr("src", "component/breathbattery.html");

      $("#containerBattery").show(500);
    }
    playVideo();
  }

  function loadWaveFrame() {
    if ($("#containerWave").is(":visible")) {
      $("#frameWave").attr("src", "");
      $("#containerWave").hide(500);
      //$("#frameStatsSheet").attr("src", _StatsSheetUrl);
      $("#containerStatsSheet").show(500);
    } else {
      $("#frameWave").attr("src", "component/wave.html?ver=1");
      $("#containerWave").show(500);

      // $("#frameStatsSheet").attr("src", "");
      $("#containerStatsSheet").hide(500);
    }

    playVideo();
    $("#collapseControlsSettings").collapse("toggle");
  }

  function musicSelected(value) {
    $("#audioMeditation").attr("src", value);
  }

  function playMeditationAudio() {
    $("#audioMeditation")[0].play();
  }

  function pauseMeditationAudio() {
    $("#audioMeditation")[0].pause();
  }

  function setMeditationMusicVolume(value) {
    $("#audioMeditation")[0].volume = value;
    $("#rangeMeditationMusicVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function playVideo() {
    try {
      if ($("#videoDummy").is(":visible")) {
        pauseVideo();
      } else {
        $("#videoDummy").show();
        $("#videoDummy")[0].volume = 0;
        $("#videoDummy")[0].play();
        console.log("Video Playing Started....");
      }
    } catch (err) {
      $("#errorMessage").html("Video playing failed! " + err);
      console.log("Video playing failed! ", err);
    }
  }

  function pauseVideo() {
    $("#videoDummy")[0].pause();
    $("#videoDummy").hide();
  }

  // Chunk Progress
  var __AppEnabledStatus = false;
  function checkboxAppOnOffChanged() {
    __AppEnabledStatus = setInterval(processBeHereNow, 1000);
  }

  function showTimeElaspeProgress(min, sec) {
    let elaspePercent = ((min % 5) * 60 + sec) / 3;
    $("#chunkStatus").width(elaspePercent + "%");

   let elaspePercentQ = ((min % 15) * 60 + sec) / 9;  
     $("#quarterStatus").width(elaspePercentQ + "%");

  }

  // ******* TIME Functions *******
 


  function showCurrentTime(hours, min, sec) {
    let hrs = hours % 12;
    var timeNow =
      //  (hrs === 0 ? "12" : pad(hrs, 2)) +   ":" +
      pad(min, 2) + ":" + pad(sec, 2);
    // +            " "
    // +            (hours > 12 ? "PM" : "AM");
    $("#currentTime").text(pad(sec, 2));
  }

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }
});
