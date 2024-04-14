//  https://fontawesome.com/v4/icons/

$(document).ready(function () {

  $("#scriptVersion").html("v1.2");
  var __ApiCallStatus = false;

  var __CurrentRow = 0;
  var __LastCurrentRow = 0;
  var __LoggedRow = 0;
 
  var __retry = 0;
  var __bhavJsonUrl = "data/bhav.json?ver=1.8";
  const _HeadRows = 4;

  const _GoogleApiUrl =     "https://script.google.com/macros/s/AKfycbwmRGX2IpmYkiVH1-SiRUc5qtVMZad98G-Y_SFea0Y/dev";
  

  const _UpdaterApiUrl =     "https://script.google.com/macros/s/AKfycbwmRGX2IpmYkiVH1-SiRUc5qtVMZad98G-Y_SFea0Y/dev";
  //const _UpdaterApiUrl =  "https://script.google.com/macros/s/AKfycbwzpkgzkXjosAgUXxcv3L2LefBTsqDw6N-6t1X8D8EZ2eX7yTr5Hfm8egwZRYX_pEYZYw/exec";
   

  //(dev)  const _ResetApiUrl =     "https://script.google.com/macros/s/AKfycbw8xlLx02pJJWyaJIFMNdsT_h-C04drUlpFZeCVb4v1/dev";
  const _ResetApiUrl =
    "https://script.google.com/macros/s/AKfycbxcenhrNpgmAuRFB40o_H25EAAeoDmotbbY6xSXRxVvrl28Q9RoTq6YCmBaJ4WU2y8aVA/exec";

  
  page_Load();

  function page_Load() {
    console.log("🅒🅛🅞🅒🅚  🅓🅐🅡🅢🅗🅐🅝 Page Loading....");

    $("#success-alert").hide();


    $("#btnPlayVideo").on("click", playVideo);
    $("#btnResetSheet").on("click", oneClickResetSheet);
    $("#btnPopup").on("click", btnPopupClick);
    $("#btnExcel").on("click", btnExcelOpenClick);

    $("#clock-container").on("click", oneClickTracker);
    //$("#ClockInnerCircle").on("click", oneClickTracker);
    //$("#centerCoreD").on("click", oneClickTracker);
     

    $("#btnDocument").on("click", btnDocumentClick);

    $("#btnPlayVideo").on("click", toggleCollapse);
    $("#radio-Music-Meditation").on("click", setAudioMode);
    $("#radio-Music-Chunk").on("click", setAudioMode);
    $("#radio-Music-Off").on("click", setAudioMode);
    $("#btnTestChunkAudio").on("click", testChunkAudio);

    $("#btnTest").on("click", function (event) {
      sendNotification("Be Here Now.");
    });

    $("#btnDarkBag").on("click", function (event) {
      $("body").addClass("blackBag");
      $("#clockContainer").removeClass("bg-white");
      $("#radio-div").removeClass("bg-white");
    });

    $("#btnAudioModeDisplay").on("click", function (event) {
      //$("#radio-Music-Off").click();
      playMeditation();
    });   

    $(window).focus(function() {
      console.log('Welcome (back)');
      postToGoogle(false, false, true, false);      
   });
 
   postToGoogle(false, false, true, false);  
    
  }



  var __AppEnabledStatus = setInterval(processBeHereNow, 1000);

  // Clock hands position
  var __ClockdarshanStatus = setInterval(function () {
    function r(el, deg) {
      el.setAttribute("transform", "rotate(" + deg + " 50 50)");
    }
    var d = getCurentTime();
    let hours = d.getHours();
    let hourDeg = 30 * (hours % 12) + d.getMinutes() / 2;
    let minDeg = 6 * d.getMinutes();
    let deg = getOnePointerDegree(hourDeg, minDeg);

    r(onepointerBase, deg);
    r(onepointerCircle, deg);
    r(hourHand, hourDeg);
    r(minHand, 6 * d.getMinutes());
  }, 1000);

  function processBeHereNow() {
    try {
      let now = getCurentTime();
      let min = now.getMinutes();
      let sec = now.getSeconds();
      let hour = now.getHours();

      // show Current Time
      showCurrentTimeLeft(min, sec);
 

      showTimeElaspeProgress(min, sec);

      if (sec === 1 || sec === 31) playAlertAudio(hour, min, sec);

      __CurrentRow = getCurrentTrackerTimeRow();

      setBhavImage(__CurrentRow);     

      $("#lblCurrentRow").html(__CurrentRow);

      console.log($("#selectChunks").val());

      if (__CurrentRow !== __LoggedRow && __LoggedRow !== 0) {
        // $("#clock-row").addClass("bag rounded-circle");
        $("body").addClass("bag");
      } else {
        //$("#clock-row").removeClass("bag rounded-circle");
        $("body").removeClass("bag");
      }



      if (sec === 1) {
        if (min % 15 === 0) {
          console.log("🕞 15 mins Quarter Shift Called");
          postToGoogle(false, false,false,false);
          $("#radio-mind-3").click();
          sendNotification("Take a deep Breath");
        } else {
           if($("#selectChunks")[0].selectedIndex == 0)
           {
            postToGoogle(false, true, false,false);
            console.log("Refreshed every min at " + hour + ":"+ min);
           }

         
        }
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  function toggleCollapse() {
    $("#collapseSettings").collapse("toggle");
  }

  function setAudioMode() {
    // Display selected misic mode
    $("#audioModeDisplay").removeClass("fa-volume-off");
    $("#audioModeDisplay").removeClass("fa-volume-up");
    $("#audioModeDisplay").removeClass("fa-music");

    let musicMode = $(".radioMusic:checked").val();

    switch (musicMode) {
      case "C":
        $("#audioModeDisplay").addClass("fa-volume-up");
        break;
      case "M":
        $("#audioModeDisplay").addClass("fa-music");
        break;
      default:
        $("#audioModeDisplay").addClass("fa-volume-off");
        break;
    }
    toggleCollapse();
  }

  function playAlertAudio(hour, min, sec) {
    let musicMode = $(".radioMusic:checked").val();

    //  console.log("Music Mode:", musicMode);

    if (musicMode != "C" && musicMode != "M") return;

    let src = "";
    let qMins = min % 15;

    if (musicMode == "C") {
      if (sec === 1 && qMins == 0) {
        src = "dhyan/0.alert_Zeta.mp3";
      }
    } else if (musicMode == "M") {
      if (sec === 1) {
        //  console.log("Inside look:", qMins);
        switch (qMins) {
          case 0:
            src = getChunkMedia(hour, min);
            break;
          case 5:
            src = "dhyan/5.alert_Attension_Seeker.wav";
            break;
          case 10:
            src = "dhyan/10.alert_Pebbles.mp3";
            break;
        }
      }

      if (sec === 31) {
        switch (qMins) {
          case 2:
            src = "dhyan/2.5.alert_Tuk_Tuk.mp3"; //alert_Apple_Message_tone.mp3
            break;
          case 7:
            src = "dhyan/7.5_sword-clash.mp3";
            break;
          case 12:
            src = "dhyan/12.5.coins-falling-on-floor.mp3";
            break;
        }
      }
    }

    if (src !== "") {
      console.log("🎵 Audio Play", min, qMins + "-" + sec, src);

      try {
        let audioAlert = $("#audioCD");
        audioAlert.attr("src", "media/" + src);
        audioAlert[0].play();
      } catch (error) {
        console.log("playAlertAudio Error", error);
        $("#errorMessage").html("playAlertAudio Error: " + error);
      }
    }
  }

  function getChunkMedia(hour, min) {
    if (min == 0) {
      if (hour % 3 == 0) return "chunk/1_Gan_Ganapataye_Namaha.mp3";
      if (hour % 3 == 1) return "chunk/2_Mahalakshmi_NamoNamaha.mp3";
      if (hour % 3 == 2) return "chunk/3_Saraswathi_Namasthubyam.mp3";
    }
    if (min == 15) {
      if (hour % 3 == 0) return "chunk/4_Om_Chaitanya_Gagangiri.mp3";
      if (hour % 3 == 1) return "chunk/5_Annapoorne_Sada_Poorne.mp3";
      if (hour % 3 == 2) return "chunk/6__Har_Har_Narmade_Har.mp3";
    }
    if (min == 30) {
      if (hour % 3 == 0) return "chunk/7_Durge_Durghat_Bhari.mp3";
      if (hour % 3 == 1) return "chunk/8_Aarti_Hanuman_ki_Anup.mp3";
      if (hour % 3 == 2) return "chunk/9_Buddham_Saranam_Gacchami.mp3";
    }
    if (min == 45) {
      if (hour % 3 == 0) return "chunk/10_Om_Namah_Shivay_Kalpataru.mp3";
      if (hour % 3 == 1) return "chunk/11_Arunachala_Siva_Track.mp3";
      if (hour % 3 == 2) return "chunk/12_Hare_Krishna_Badahari.mp3";
    }

    return "dhyan/0.alert_china_sameer.mp3";
  }

  function testChunkAudio() {
    let selvalue = $("#selectTestChunkAudio").val();
    console.log("testChunkAudio called ", selvalue);

    switch (selvalue) {
      case "1":
        playAlertAudio(6, 0, 1);
        break;
      case "2":
        playAlertAudio(7, 0, 1);
        break;
      case "3":
        playAlertAudio(8, 0, 1);
        break;
      case "4":
        playAlertAudio(6, 15, 1);
        break;
      case "5":
        playAlertAudio(7, 15, 1);
        break;
      case "6":
        playAlertAudio(8, 15, 1);
        break;
      case "7":
        playAlertAudio(6, 30, 1);
        break;
      case "8":
        playAlertAudio(7, 30, 1);
        break;
      case "9":
        playAlertAudio(8, 30, 1);
        break;
      case "10":
        playAlertAudio(6, 45, 1);
        break;
      case "11":
        playAlertAudio(7, 45, 1);
        break;
      case "12":
        playAlertAudio(8, 45, 1);
        break;
    }
  }

  function playMeditation() {
    $("#audioMed")[0].play();
  }

  function sendNotification(title) {
    console.log("Notification Sent.");

    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        const greeting = new Notification(title, {
          body: "Clock Darshan... Take a Deep Breath.",
        });
      }
    });
  }

  function setBhavImage(imageRow) {    

    if ($("#imgBhav").attr("src").includes(imageRow)) return;

    if (imageRow < 28 && !$("#imgBhav").attr("src").includes("svg")) {
      $("#imgBhav").attr("src", "img/line.svg");
    } else {
      $("#imgBhav").attr("src", "img/bhav/" + imageRow + ".jpg");
    }
   
  }

 // function postToGoogle(update, minLoad) {
  function postToGoogle(update,minLoad,init,reset) {  
    if (!update) {
      if (__retry > 2) {
        $("#errorMessage").html("📛 Max Retry Reached.");
        return;
      }

      if (__ApiCallStatus == true) return;
    }

    if (minLoad) {
      $("#minLoad-div").removeClass("d-none");
    } else { //init
      $("#processing-div").removeClass("d-none");      
    }

    console.log("Posting to Google api...");

    __ApiCallStatus = true;
    $("#errorMessage").html("");

    let paramChant =  $("#txtChant").val(); 
    let paramRowCurrent = getCurrentTrackerTimeRow();
    let paramRowUpdate = paramRowCurrent;
    let paramPostType = 0; //init and minLoad

    if (update) {
      paramRowUpdate = $("#selectChunks").val();
      paramPostType = 1;
    } 

    if(reset)
    paramPostType = 2;
     

    let queryString =  "?rowcurrent=" + paramRowCurrent + "&rowupdate=" + paramRowUpdate + "&chant=" + paramChant + "&posttype=" + paramPostType ;

    let googleurl = _GoogleApiUrl + queryString;

    // console.log("Api QueryString Request:", queryString);

    $.ajax({
      url: googleurl,
      cache: false,
      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        // console.log("Api Response Data:", data);

        try {

          if (data && data.chunks) {

            $('#selectChunks').find('option').remove();
          $.each(data.chunks, function() {
            let chant = this.chant;
            if(chant == "")
              chant = "🌑"
            let text =this.chunk + "【" + chant + "】" + this.k10;
            $("#selectChunks").append($("<option />").val(this.row).text(text));
        });

        if (update) 
        $("#txtChant").val(""); 

      }
/*
          if (data && data.chunks) {
            __LastCurrentRow = data.currentRow;
            __LoggedRow = data.loggedRow;

            $("#lblLastCurrentRow").html(__LastCurrentRow);
            $("#lblLoggedRow").html(__LoggedRow);
            $("#lblUpdateTime").html(
              getCurentTime().toLocaleTimeString()
            );

            // console.log("__LastCurrentRow", __LastCurrentRow);
            // console.log("__LoggedRow", __LoggedRow);
            if (update) 
              $("#txtChant").val(""); 

            $('#iframeChantChart').attr("src", $('#iframeChantChart').attr("src"));

            $("#lblM5").html(data.counts.calm);
            $("#lblM4").html(data.counts.med);
            $("#lblM3").html(data.counts.apramad);
            $("#lblM2").html(data.counts.pramad);
            $("#lblM1").html(data.counts.buzz);

            $("#chant-current").html(data.chant.current);
            $("#chant-p100").html(data.chant.p100);
            $("#chant-p70").html(data.chant.p70);

            $("#containerPath").html("");

            for (let i = data.chunks.length - 1; i >= 0; i--) {
             // var divRow = createChunkDiv(data.chunks[i], data.currentRow);
             // document.getElementById("containerPath").appendChild(divRow);
              createChunkRadios(data.chunks[i], data.currentRow);
            // document.getElementById("containerPath").appendChild(radio);
         
              
            }

            __ApiCallStatus = false;
          }
          */
          __ApiCallStatus = false;

        } catch (err) {
          console.log(
            "Unhandled Error while processing postToGoogle response",
            err
          );
          $("#containerPath").html(err);
          $("#errorMessage").html("Unhandled Error postToGoogle: " + err);
          //buildPlatform();
        }

        $("#processing-div").addClass("d-none");
       
        $("#minLoad-div").addClass("d-none");
        __ApiCallStatus = false;
      },
      error: function (xhr, error_text, statusText) {
        __ApiCallStatus = false;
        $("#errorMessage").html(
          "(" + __retry + ") Api Error Response -" + error_text
        );
        //_UpdaterApiUrl = _UpdaterApiUrl2;
        __retry = __retry + 1;
        buildPlatform();
        console.log("error_text", "Api Error Response -" + error_text);
        $("#containerPath").html(error_text);
        $("#processing-div").addClass("d-none");
        $("#minLoad-div").addClass("d-none");
      },
    });
  }

 

  

 

  function getTrackerRow(h, q) {
    return h * 4 + q + 3;
  }

  function getTrackerChunk(row) {
    row = row - 4;
    hour = Math.floor(row / 4);

    if (hour > 12) hour = hour - 12;

    return hour.toString().padStart(2, "0") + "-" + ((row % 4) + 1);
  }

  function eyeOpenClose() {
    $("#apramadCtrl").html("&#xf070");
    //$("#pramadCtrl").html("&#xf2a8");

    setTimeout(function () {
      $("#apramadCtrl").html("&#xf06e");
      // $("#pramadCtrl").html("&#xf2a8");
    }, 1000);
  }

  eyeOpenClose();
  setInterval(eyeOpenClose, 2000);

  function getCurrentTrackerTimeRow() {
    let now = getCurentTime();
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

  function showTimeElaspeProgress(min, sec) {
    let elaspePercentQ = ((min % 15) * 60 + sec) / 9;
    $("#quarterStatus").width(elaspePercentQ + "%");

    $("#timeLeftDiv").css(
      "background",
      "linear-gradient(to right ,#ff2e2d " +
        elaspePercentQ +
        "%, #22e8f7 " +
        (100 - elaspePercentQ) +
        "% )"
    );
  }



  function showCurrentTimeLeft(min, sec) {
    //var timeNow = pad(14 - (min % 15), 2) + ":" + pad(60 - sec, 2); //Tile left
    var timeNow = pad(min % 15, 2) + ":" + pad(sec, 2);
    $("#timeLeft").text(timeNow);

    $("#timeRefresh").text(60 - sec);
  }

  // Media

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
      toggleCollapse();
    } catch (err) {
      $("#errorMessage").html("Video playing failed! " + err);
      console.log("Video playing failed! ", err);
    }
  }

  function pauseVideo() {
    $("#videoDummy")[0].pause();
    $("#videoDummy").hide();
  }

  function btnPopupClick() {
    var myWindow = window.open(
      window.location.href,
      "",
      "width=455,height=625"
    );
  }

  function btnExcelOpenClick() {
    window.open(
      "https://docs.google.com/spreadsheets/d/1nOrZM3sExoxmFgyzhiwi6BrPvQT-9Omlt2x5kno8H5w/edit#gid=1698318143",
      "_blank"
    );
  }

  function btnDocumentClick() {
    window.open(
      "https://docs.google.com/document/d/e/2PACX-1vT4pM35KYG2IRyYIAFq7sI5WVQGYxVA0hBrBUCy16HQ547PzHoVfmA3MwdI6W2ttY7FSOlvxuBY70Un/pub",
      "_blank"
    );
  }

  // ******* TIME Functions *******

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }

 



  function oneClickResetSheet() {
    toggleCollapse();

    if (confirm("Are you sure want to reset?")) {
      resetSheet();
    }
    return false;
  }

  function getCurentTime() {
    return new Date();

    //ToDo: Refactor if needed
    var d1 = new Date();
    var d2 = new Date(
      d1.getUTCFullYear(),
      d1.getUTCMonth(),
      d1.getUTCDate(),
      d1.getUTCHours(),
      d1.getUTCMinutes(),
      d1.getUTCSeconds()
    );
    d2.setHours(d2.getHours() - 5);

    return d2;
  }

  function resetSheet() {
    $("#processing-div").removeClass("d-none");
    __ApiCallStatus = true;

    $.ajax({
      crossOrigin: true,
      url: _ResetApiUrl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("oneClickResetSheet response data", data);
        //alert('SUCCESS - ' + data)
        $("#errorMessage").html(data);
        __ApiCallStatus = false;
        postToGoogle(true,false,false,true);
      },
      error: function (xhr, error_text, statusText) {
        //alert('Sheet Reset Done with - ' + error_text)
        console.log("error_text", error_text);
        $("#errorMessage").html("Reset action Error: " + error_text);

        __ApiCallStatus = false;
      },
    });
  }

  //
  function getOnePointerDegree(hourDeg, minDeg) {
    let hdeg = 15;
    let hrem = hourDeg % 90;

    let mrem = minDeg % 90;

    if (hrem >= 30) hdeg = 45;
    if (hrem >= 60) hdeg = 75;

    return minDeg - mrem + hdeg;
  }

  function oneClickTracker() {
    postToGoogle(true,false,false,false);
  }
  // End of Code
});
