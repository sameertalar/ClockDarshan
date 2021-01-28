$(document).ready(function () {
  //Constants
  const timeIntervalPlayBeforeAlert = 1000;
  const timeIntervalTimePlay = 2500;
  const timeIntervalPopupAlert = 6000;
  const MEDIA_ROOT = "../ClockDarshanMedia/";
  const Pause_Text = "|| APP PAUSED ||";

  // Globle Variables
  var __timeInterval = 0;
  var __tickerState = 0;
  var __CurrentChunk = 0;
  var __AppEnabledStatus = false;
  var __ClockdarshanStatus = false;
  var __dataConfig;
  var __dataAudio = [];
  var __dataProfile = [];
  var __dataSpeechTexts = [];
  var __alertPlayIndicator = 0;
  var _chantCount = 0;
  var _chantCountPast = 0;
  var _chantListingOn = false;
  var recognition =
    new webkitSpeechRecognition() ||
    root.mozSpeechRecognition ||
    root.msSpeechRecognition ||
    root.oSpeechRecognition ||
    root.SpeechRecognition;
  recognition.continuous = true;
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Page_Load EVENTS
  page_Load();

  // FUNCTIONS

  function checkboxIncognitoChanged() {
    if ($("#checkboxIncognito").is(":checked")) {
      $("#clock-container").css(
        "background-image",
        "url('img/ClockDarshanIncognito.png')"
      );
      $("#selectProfile").val("Incognito");
    } else {
      $("#clock-container").css(
        "background-image",
        "url('img/clockDarshan.png')"
      );
      $("#selectProfile").val("PopularSongText");
    }

    __CurrentChunk = 0;
    selectProfileOnChange();
    //checkboxAppOnOffChanged();
  }

  function checkboxAppOnOffChanged() {
    pauseAlertAudio();
    pauseMeditationAudio();
    __CurrentChunk = 0;

    if ($("#checkboxAppOnOff").is(":checked")) {
      $("#checkboxAlertsOn").prop("checked", true);

      __AppEnabledStatus = setInterval(processBeHereNow, 1000);
      $("#displayNaam").text("Namaste");
      $("#displayNaam").css("background-color", "gray");

      $("#clockContainer").show(500);

      __ClockdarshanStatus = setInterval(function () {
        function r(el, deg) {
          el.setAttribute("transform", "rotate(" + deg + " 50 50)");
        }
        var d = new Date();
        r(hour, 30 * (d.getHours() % 12) + d.getMinutes() / 2);
        r(min, 6 * d.getMinutes());
      }, 1000);

    
    } else {
      $("#checkboxAlertsOn").prop("checked", false);

      clearInterval(__AppEnabledStatus);
      clearInterval(__ClockdarshanStatus);
      $("#currentTime").text("Be Here Now");
      $("#displayNaam").text(Pause_Text);
      $("#displayNaam").css("background-color", "gray");

      document.title = "Be Here Now";
      $("#clockContainer").hide(500);
      pauseVideo();
      pauseAllAudios();
    }
  }

  function processBeHereNow() {
    try {
      let now = new Date();
      let hours = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();
      let ms = now.getMilliseconds() / 1000;

      // console.log(" processBeHereNow at ", new Date());

      // show Current Time
      showCurrentTime(hours, min, sec);

      // Time Elaspe Progress
      showTimeElaspeProgress(min, sec);

      //Ticker Ticking
      tickerTick();

      // Auto Turn Off App
      autoTurnOffApp(hours, min, sec);

      if (__alertPlayIndicator !== (min - (min % 5)) * 60 + sec) {
        //To avoid repeate alert
        if ($("#checkboxQuarterMode").is(":checked")) {
          if (min % 15 === 0 && sec === 1) {
            playNotification( hours, min, sec, ms);
            console.log(" 🔔***** Quarter (15 min) alert at ", new Date());
          }
        } else {
          let fiveChunk = min % 5;

          let chunkNow = fiveChunk === 0 && sec === 1;
      

          if (chunkNow) {
            playNotification( hours, min, sec, ms);
            console.log(" 🔔***** Chunk (5 min) alert at ", new Date());
          }
      
        }

        if (min % 15 === 0 && sec === 1) {
          _chantCountPast = _chantCount;
          _chantCount = 0;
          $("#chant-count-past").html(_chantCountPast);
          $("#listen-chant-count").html(_chantCountPast);
          $("#listen-chant-Output").html("");
          setTrackerTime();
        }
      }

      // DisplayText
      displayNameText(min - (min % 5), sec);
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  function page_Load() {
    console.log(
      "%cClock Darshan",
      "font-weight: bold; font-size: 50px; color: #ff4f51; text-shadow: 1px 1px 0px black, 1px -1px 0px black, -1px 1px 0px black, -1px -1px 0px black;"
    );

    $.getJSON("data/config.json", function (data) {
      __dataConfig = data;

      populateConfigSelectLists();
    });

    $.getJSON("data/speech.text.json", function (data) {
      __dataSpeechTexts = data;
    });

    $.getJSON("data/audio.json", function (data) {
      __dataAudio = data;
      populateSelectAudioLists();
    });
    $.getJSON("data/profile.json", function (data) {
      __dataProfile = data;
      populateProfileLists();
      $("#selectProfile").prop("selectedIndex", 0);
      selectProfileOnChange(true);
    });

    for (let h = 0; h < 24; ++h) {
      for (let m = 1; m <= 4; ++m) {
        $("#selectTrackerTime").append(
          $("<option></option>")
            .attr("value", h + "-" + m)
            .text( (h % 12) + (h > 12 ? "pm" : "am") + " : " + m + " Q")
        );
      }
    }

    /* Bind Events */

    //Tracker
    $("#success-alert").hide();
    $("#btnTracker").on("click", postToGoogle);
    $("#plusQuarter").on("click", plusQuarter);
    $("#minusQuarter").on("click", minusQuarter);
    $("#refreshQuarter").on("click", setTrackerTime);

    $("#ClockInnerCircle").on("click", oneClickTracker);

    // Settings
    $("#selectProfile").on("change", function (event) {
      selectProfileOnChange(false);
    });

    $("#collapseControlsTracker").on("show.bs.collapse", function () {
      setTrackerTime();
      $("#success-alert").hide();
    });
    $("#collapseControlsTracker").on("hide.bs.collapse", function () {
      displayTrackers();
      $("#success-alert").hide();
    });

    $("#selectChunkNotifyMode").on("onchange", selectChunkNotifyModeOnChange);
    $("#checkboxListenChant").change(checkboxListenChantOnChanged);

    // Main
    $("#btnTryChunk").on("click", tryChunkClick);
  

    $("#btnBatteryLoader").on("click", loadBatteryFrame);
    $("#btnTrackerSheetLoader").on("click", loadTrackerSheetFrame);
    

    $("#btnWaveLoader").on("click", loadWaveFrame);

    //Audio Meditation
    $("#btnPlayMeditationnAudio").on("click", playMeditationAudio);
    $("#btnPauseMeditationAudio").on("click", pauseMeditationAudio);

    $("#checkboxTicker").on("onchange", checkboxTickerChanged);
    $("#selectTickerDuration").on("onchange", checkboxTickerChanged);

    $("#radioMeditationMusic18").on("change", function (event) {
      musicSelected(this.value);
    });

    $("#radioMeditationMusic20").on("change", function (event) {
      musicSelected(this.value);
    });

    $("#radioMeditationMusicChantBreath").on("change", function (event) {
      musicSelected(this.value);
    });
    $("#radioMeditationMusicChant").on("change", function (event) {
      musicSelected(this.value);
    });

    //Audio Notifications
    $("#btnChunkBeforeAlertAudioTry").on("click", function (event) {
      testAudioAlert(this);
    });
  

    $("#btnTickerAudioTry").on("click", function (event) {
      testAudioAlert(this);
    });

    $("#selectTickerAudio").on("change", function (event) {
      tickerAudioChanged(this.id);
    });

    $("#btnPauseAllAudios").on("click", pauseAllAudios);

    // Volume
    $("#rangeMeditationMusicVolume").on("change", function (event) {
      setMeditationMusicVolume(this.value);
    });
    $("#rangeAlertAudioVolume").on("change", function (event) {
      setAlertAudioVolume(this.value);
    });
    $("#rangeSpeechVolume").on("change", function (event) {
      setSpeechVolume(this.value);
    });
    $("#rangeTickerVolume").on("change", function (event) {
      setTickerAudioVolume(this.value);
    });
    $("#rangeTimeAlertVolume").on("change", function (event) {
      setTimeAlerVolume(this.value);
    });

    // Tools
    $("#btnGenerateQueryString").on("click", generateQueryString);
    $("#btnOpenPopupApp").on("click", openOpupApp);

    setSpeechVolume(0.7);
    setAlertAudioVolume(0.5);
    setMeditationMusicVolume(0.8);
    pauseAlertAudio();
    pauseMeditationAudio();

    $("#radioMeditationMusic20").val(MEDIA_ROOT + "SaReGaMa20Sec.mp3");
    $("#radioMeditationMusic18").val(MEDIA_ROOT + "saregama18Sec.mp3");
    $("#radioMeditationMusicChantBreath").val(
      MEDIA_ROOT + "audios/ChunkChantBreath_45_Shiv.mp3"
    );
    $("#radioMeditationMusicChant").val(
      MEDIA_ROOT + "audios/ChunkChant_45_Shiv.mp3"
    );

    $("#audioMeditation").attr("src", MEDIA_ROOT + "saregama18Sec.mp3");
    $("#audioAlert").attr("src", MEDIA_ROOT + "alerts/alert_Google_Event.mp3");
    $("#audioTicker").attr(
      "src",
      MEDIA_ROOT + "alerts/ticking_Water_Two_Drops.mp3"
    );
    $("#videoDummy").attr("src", MEDIA_ROOT + "video_dummy.mp4");
  }

  $("#checkboxAppOnOff").change(checkboxAppOnOffChanged);
  $("#checkboxAlertsOn").change(checkboxAlertsOnChanged);
  $("#checkboxIncognito").change(checkboxIncognitoChanged);

  function populateSelectAudioLists() {
    $.each(__dataAudio.alerts, function (index, value) {
      $("#selectChunkBeforeAlertAudio").append(
        $("<option></option>")
          .attr("value", value.id)
          .text(value.text)
          .attr("data-filename", value.fileName)
      );
    
    });
    $.each(__dataAudio.tickers, function (index, value) {
      $("#selectTickerAudio").append(
        $("<option></option>")
          .attr("value", value.id)
          .text(value.text)
          .attr("data-filename", value.fileName)
      );
    });

    $("#selectChunkBeforeAlertAudio").prop("selectedIndex", 2);
  
    $("#selectTickerAudio").prop("selectedIndex", 2);
  }

  function populateProfileLists() {
    $.each(__dataProfile, function (index, value) {
      $("#selectProfile").append(
        $("<option></option>")
          .attr("value", value.profileValue)
          .text(value.displayText)
      );
    });
  }

  function populateConfigSelectLists() {
    $.each(__dataConfig.notifyModes, function (index, value) {
      $("#selectChunkNotifyMode").append(
        $("<option></option>").attr("value", value.value).text(value.text)
      );
 
    });

    $.each(__dataConfig.trackerConfigs.mind, function (index, value) {

      /*
      $("#selectMind").append(
        $("<option></option>").attr("value", value.code).text(value.title)
      );
      */

      $('#containerMind')
      .append(`<div class="form-check form-check-inline mr-2">`)     
      .append(`<label class="form-check-label  " for="${value.code}">${value.title.substring(0, 2 ) }  </label>`)
      .append(`<input type="radio" class="radioMind form-check-input mt-4   " id="radioMind${value.code}" name="radioMind" value="${value.code}">`)
      .append(`</div> `);
 

    });

    $("#radioMindA").prop("checked", true);

    $.each(__dataConfig.trackerConfigs.energy, function (index, value) {
      $('#containerEnergy')
      .append(`<div class="form-check form-check-inline mr-2">`)     
      .append(`<label class="form-check-label " for="${value.code}">${value.title.substring(0, 2) }  </label>`)
      .append(`<input type="radio" class="radioEnergy form-check-input  mt-4  " id="radioEnergy${value.code}" name="radioEnergy" value="${value.code}">`)
      .append(`</div> `);
    });

    $.each(__dataConfig.trackerConfigs.work, function (index, value) {
      $('#containerWork')
      .append(`<div class="form-check form-check-inline mr-2">`)     
      .append(`<label class="form-check-label " for="${value.code}">${value.title.substring(0, 2) }  </label>`)
      .append(`<input type="radio" class="radioWork form-check-input  mt-4  " id="radioWork${value.code}" name="radioWork" value="${value.code}">`)
      .append(`</div> `);
    });

    setTrackerTime(true); // Load
  }

  function playNotification( hours, minuteChunk, sec, ms) {
    if (!$("#checkboxAlertsOn").is(":checked")) {
      return;
    }

    let alertMode;
    __timeInterval = 0;
    __alertPlayIndicator = minuteChunk * 60 + sec;
    console.log("__alertPlayIndicator: ", __alertPlayIndicator);

    if (
      __dataConfig.chunkConfigs === null ||
      __dataConfig.chunkConfigs.length < 1
    ) {
      $("#errorMessage").html("Unable to load json data");
      return false;
    }

    alertMode =$("#selectChunkNotifyMode").val();

 
    // 1.Before Alert
    playBeforeAlertAudio();

    // 2.Play Time
    setTimeout(function () {
      playTimeAlert(hours, minuteChunk);
    }, __timeInterval);

    __timeInterval += timeIntervalTimePlay;

    // 3.Play Notification

    if (alertMode !== "Silent") {
      let arrayAlertMode = alertMode.split("_");

      let mediaType = arrayAlertMode[0];
      let cluster = arrayAlertMode[1];

      if (mediaType === "Audio") {
        $.each(__dataAudio.clusterAudios, function (index, value) {
          if (value.chunk == minuteChunk) {
            let filename = value[cluster];
            let volume = 1;

            setTimeout(function () {
              playNotificationAudio(minuteChunk, filename, volume);
            }, __timeInterval);

            return false;
          }
        });
      }

      if (mediaType === "Text") {
        $.each(__dataSpeechTexts, function (index, value) {
          if (value.chunk == minuteChunk) {
            let textmessage = value[cluster + "Text"];
            let isEng = value[cluster + "Lang"] == "eng" ? true : false;

            setTimeout(function () {
              talkText(textmessage, isEng, false);
            }, __timeInterval);
            console.log(
              "playNotification() for textmessage ",
              textmessage,
              " minuteChunk:",
              minuteChunk
            );

            return false;
          }
        });
      }
      __timeInterval = 0;
    }

    // 4.Post Alerts
    popupAlertChunkName( minuteChunk, hours % 12);
    vibrationNotification();
  }

  function displayNameText(minuteChunk) {
    // console.log("displayNameText at", minuteChunk, __CurrentChunk);
    if (
      __CurrentChunk !== minuteChunk ||
      $("#displayNaam").html() === Pause_Text
    ) {
      $.each(__dataConfig.chunkConfigs, function (index, value) {
        if (minuteChunk === value.chunk) {
          let displayText = $("#checkboxIncognito").is(":checked")
            ? value.displayIncogText
            : value.displayText;

          $("#displayNaam").html(displayText);

          $("#displayNaam").css("background-color", value.color);
          __CurrentChunk = minuteChunk;
          document.title = displayText;
        }
      });
    }
  }

  function playTimeAlert(hours, minuteChunk) {
    let mode = $("#selectTimeAlertMode").val();

    switch (mode) {
      case "Text":
        let hrs = hours % 12;
        let timeText = "Time ";

        if (hrs === 0) hrs = 12;
        timeText += " " + hrs + " ";
        if (minuteChunk === 0) timeText += hours > 12 ? "PM" : "AM";

        if (minuteChunk > 0) timeText += minuteChunk;

        talkText(timeText, true, true);
        break;
      case "Audio":
        playTimeAudioAlert(hrs);

        setTimeout(function () {
          playTimeAudioAlert(minuteChunk);
        }, 1000);
        break;
      case "TextBroken":
      case "AudioBroken":
        let timearray = pad(minuteChunk, 2).split("");
        let interval = 1000;

        $.each(timearray, function (index, value) {
          if (mode === "AudioBroken") {
            setTimeout(function () {
              playTimeAudioAlert(value);
            }, interval);
            interval += 1000;
          }

          if (mode === "TextBroken") {
            talkText(value, true, true);
          }
        });

        break;

      default: // Silent
      // none
    }

    if (mode !== "Silent") {
      // timeInterval += timeIntervalTimePlay;
      console.log(
        "Time Played at time:",
        hours + ":" + minuteChunk,
        " mode:",
        mode
      );
    }
  }

  // ******* TIME Functions *******
  function showCurrentTime(hours, min, sec) {
    let hrs = hours % 12;
    var timeNow =
      //  (hrs === 0 ? "12" : pad(hrs, 2)) +   ":" +
      pad(min, 2) + ":" + pad(sec, 2);
    // +            " "
    // +            (hours > 12 ? "PM" : "AM");
    $("#currentTime").text(timeNow);
  }

  function showTimeElaspeProgress(min, sec) {
    let elaspePercent = ((min % 5) * 60 + sec) / 3;
    //$("#controltimeStatus").val() = elaspePercent;

    $("#chunkStatus").width(elaspePercent + "%");

    /*
            $("#timeStatus").style.backgroundImage =
              " -webkit-linear-gradient(left, #005CC8, #005CC8 " +
              elaspePercent +
              "%, transparent " +
              elaspePercent +
              "%, transparent 5%)";

              */

    // $("#statusdot").style.left = "100%";
  }

  function checkboxTickerChanged() {
    __tickerState = 0;
  }

  function tickerTick() {
    if ($("#checkboxTicker").is(":checked")) {
      if (__tickerState == parseInt($("#selectTickerDuration").val())) {
        console.log(
          "Ticker Audio played at Ticker State:",
          __tickerState,
          " at",
          new Date()
        );
        // play audio;
        $("#audioTicker")[0].play();
        __tickerState = 0;
      }
      __tickerState++;
    }
  }

  function autoTurnOffApp(hours, min, sec) {
    if ($("#checkboxAutoOff").is(":checked")) {
      let timeSelected = $("#controlAutoOffTime").val();

      if (
        new Date("1/1/2020 " + hours + ":" + min + ":" + sec) >
        new Date("1/1/2020 " + timeSelected + ":00")
      ) {
        console.log("OFF Time  at ", timeSelected);
        $("#checkboxAppOnOff").is(":checked") = false;
        checkboxAppOnOffChanged();
      }
    }
  }

  // end TIME Functions

  // ******* Demo Functions *******
  function tryChunkClick() {
    let now = new Date();
    let min = now.getMinutes();
    let hours = now.getHours();
    playNotification( hours, min - (min % 5), 0, 0);
    playVideo();
  }

 

  // end Demo Functions

  // ******* SPEECH and LISTEN Functions *******

  function talkText(text, isEng, isTime) {
    let u = new SpeechSynthesisUtterance();
    u.text = text;

    if (isTime) {
      u.volume = $("#rangeTimeAlertVolume").val(); // 0 to 1
    } else {
      u.volume = $("#rangeSpeechVolume").val(); // 0 to 1
    }

    if (isEng) {
      u.lang = "en-US"; //en-IN
    } else {
      u.lang = "hi-IN";
    }

    u.rate = 0.8; // 0.1 to 10
    u.pitch = 0; //0 to 2

    speechSynthesis.speak(u);
  }

  function setSpeechVolume(value) {
    $("#rangeSpeechVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function checkboxListenChantOnChanged() {
    if ($("#checkboxListenChant").is(":checked")) {
      startRecording();
      $("#listen-chant-lable").addClass("bg-success");
      $("#listen-chant-lable").removeClass("bg-warning");
      $("#listen-chant-count").show();

      _chantListingOn = true;
    } else {
      stopRecording();
      $("#listen-chant-lable").removeClass("bg-success");

      $("#listen-chant-count").hide();
      _chantListingOn = false;
    }
  }

  function checkboxAlertsOnChanged() {
    if ($("#checkboxAlertsOn").is(":checked")) {
    } else {
      pauseVideo();
      pauseAllAudios();
    }
  }

  function stopRecording() {
    recognition.stop();
  }

  function startRecording() {
    recognition.onstart = function () {
      $("#listen-chant-status").removeClass("alert-danger");
      $("#listen-chant-status").addClass("alert-success");

      setTimeout(() => {
        $("#listen-chant-status").html("🔊 On");
      }, 1000);
    };
    recognition.onresult = function (event) {
      try {
        // console.log(event);
        $("#listen-chant-Output").html("");

        for (var i = 0; i < event.results.length; i++) {
          if (i === event.results.length - 1) {
            $("#listen-chant-Output").html(
              pad(i + 1, 2) + " " + event.results[i][0].transcript
            );
            //  console.log(event.results[i][0].transcript); //todo remove

            if (
              event.results[i][0].transcript.indexOf("ओम") >= 0 ||
              event.results[i][0].transcript.indexOf("नम") >= 0 ||
              event.results[i][0].transcript.indexOf("शिव") >= 0
            ) {
              _chantCount++;
              $("#listen-chant-count").html(_chantCount);
              updateTrackerOnChant();
            }
          }
        }
      } catch (error) {
        $("#errorMessage").html("Listen Chant Error" + error.error);
      }
    };
    recognition.start();

    recognition.onend = function () {
      if (_chantListingOn) {
        recognition.start();
        console.log("SpeechRecognition  RESUMED!");
      } else {
        console.log("SpeechRecognition Disconnected");

        $("#listen-chant-status").addClass("alert-danger");
        $("#listen-chant-status").removeClass("alert-success");
        $("#lableChantListen").addClass("bg-warning");

        setTimeout(() => {
          $("#listen-chant-status").html("Stopped");
        }, 1000);
      }
    };

    /*
    recognition.onaudiostart = function () {
      console.log("Audio capturing started");
    };
    recognition.onsoundstart = function () {
      console.log("Some sound is being received");
    };
    recognition.onspeechstart = function () {
      console.log("Speech has been detected");
    };

    recognition.onsoundend = function (event) {
      console.log("Sound has stopped being received");
    };

    recognition.onspeechend = function () {
      console.log("Speech has stopped being detected");
    };
    */

    recognition.onerror = function (event) {
      console.log("Listen onerror", event);
      $("#errorMessage").html("Listen onerror " + event.error);

      if (event.error == "no-speech" || event.error == "network") {
        recognition.start();
        console.log("SpeechRecognition  RESUMED on  NO Speech");
      }
    };
  }

  /*
  function updateTrackerOnChant() {
    if (_chantCount == 5) {
      $("#selectMind").val("A");
      postToGoogle();
    }

    if (_chantCount == 20) {
      $("#selectMind").val("M");
      postToGoogle();
    }

    if (_chantCount == 108) {
      $("#selectMind").val("C");
      postToGoogle();
    }
  }
*/
  // end SPEECH LISTEN Functions

  // ******* MEDIA Functions *******

  function playTimeAudioAlert(number) {
    let timeAudioAlert = $("#timeAlert");

    if (number !== 0) {
      let fileName = MEDIA_ROOT + "numbers/_number_" + number + ".mp3";
      timeAudioAlert.attr("src", fileName);
      timeAudioAlert[0].play();
    } else {
      //todo am/pm
    }

    console.log("playTimeAudioAlert() for ", number);
  }

  function tickerAudioChanged(controlId) {
    let audioTicker = $("#audioTicker");

    let fileName =
      MEDIA_ROOT +
      "alerts/" +
      $("#" + controlId)
        .find(":selected")
        .data("filename");

    console.log("Ticker audio changed to ", fileName);

    audioTicker.attr("src", fileName);
  }

  function playNotificationAudio(minuteChunk, fileName, trackVolume) {
    let audioAlert = $("#audioAlert");
    let setVolume = $("#rangeAlertAudioVolume")[0].value;
    let volume = 1;

    if (setVolume) {
      volume = setVolume;
    }

    if (trackVolume) {
      //volume = volume * trackVolume;
      volume = volume;
    }

    audioAlert[0].volume = volume;
    audioAlert.attr("src", MEDIA_ROOT + "audios/" + fileName);

    audioAlert[0].play();

    console.log(
      "playNotificationAudio() for chunk: ",
      minuteChunk,
      " file:",
      fileName,
      " volume:",
      volume,
      " trackVolume:",
      trackVolume
    );
  }



  function testAudioAlert(id) {
    let audioAlert = $("#audioAlert");
    let controlId = id.id.replace("Try", "").replace("btn", "");

    let fileName = $("#select" + controlId)
      .find(":selected")
      .data("filename");

    audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
    // alert($("#" + controlId).find(':selected').data('volume'));

    audioAlert[0].play();
  }

  function playBeforeAlertAudio() {

    let fileName =  $("#selectChunkBeforeAlertAudio")
    .find(":selected")
    .data("filename"); 

      let audioAlert = $("#audioAlert");

      if (fileName) {
        audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
        audioAlert[0].play();
        ////Todo volume
        __timeInterval += timeIntervalPlayBeforeAlert;
      } else {
        $("#errorMessage").html("Alert File missing error." );
      }
   
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

  function pauseAllAudios() {
    try {
      pauseMeditationAudio();
      pauseAlertAudio();
      $("#audioTicker")[0].pause();
      $("#timeAlert")[0].pause();
    } catch (error) {
      $("#errorMessage").html("pauseAllAudios Error" + error);
      console.log("pauseAllAudios Error", error);
    }
  }

  function playVideo() {
    try {
      $("#videoDummy")[0].volume = 0;
      $("#videoDummy")[0].play();
      console.log("Video Playing Started....");
    } catch (err) {
      $("#errorMessage").html("Video playing failed! " + err);
      console.log("Video playing failed! ", err);

      let pl22 = 20;
    }
  }

  function pauseVideo() {
    $("#videoDummy")[0].pause();
  }

  function setAlertAudioVolume(value) {
    debugger;
    $("#audioAlert")[0].volume = value;
    $("#rangeAlertAudioVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function setTickerAudioVolume(value) {
    $("#audioTicker")[0].volume = value;
    $("#rangeTickerVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function setTimeAlerVolume(value) {
    $("#timeAlert")[0].volume = value;
    $("#rangeTimeAlertVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function setMeditationMusicVolume(value) {
    $("#audioMeditation")[0].volume = value;
    $("#rangeMeditationMusicVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function pauseAlertAudio() {
    $("#audioAlert")[0].pause();
  }

  // end MEDIA Functions
  // ******* UTILITY Functions *******

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }
  function isNotNull(obj) {
    if (obj !== "null" && obj !== "undefined") return true;
    else return false;
  }

  function loadWaveFrame() {
    if ($("#containerWave").is(":visible")) {
      $("#frameWave").attr("src", "");
      $("#containerWave").hide(500);
    } else {
      $("#frameWave").attr("src", "component/wave.html");
      $("#containerWave").show(500);
    }
  }

  function loadBatteryFrame() {
    if ($("#containerBattery").is(":visible")) {
      $("#frameBattery").attr("src", "");
      $("#containerBattery").hide(500);
    } else {
      $("#frameBattery").attr("src", "component/breathbattery.html");

      $("#containerBattery").show(500);
    }
  }

  function loadTrackerSheetFrame() {
    if ($("#containerTrackerSheet").is(":visible")) {
      $("#frameTrackerSheet").attr("src", "");
      $("#containerTrackerSheet").hide(500);
    } else {
      $("#frameTrackerSheet").attr("src", "https://docs.google.com/spreadsheets/d/1IeLBIUnPFC6-raeOoD1s80C-v8-Sl5rY1p38qFlQ0RY/edit#gid=1698318143");

      $("#containerTrackerSheet").show(500);
      $("#containerTrackerSheetscroll").scrollTop(100);
    }
  }


  

  function popupAlertChunkName(minuteChunk, hours) {
    if ( $("#checkboxPopupAlert").is(":checked")) {
      $.each(__dataConfig.chunkConfigs, function (index, value) {
        if (minuteChunk === value.chunk) {
          if ($("#checkboxAlertWindow").is(":checked")) {
            let content =
              "<html><head><title>Be Here Now</title><style>body{font-family:Verdana; text-align:center;  color: aliceblue;background-color: #0d2931;}" +
              " div {border: 1px solid white;}</style></head><body onclick='window.close()'> <div  style='background-color: " +
              value.color +
              "'><h2>" +
              hours +
              ":" +
              pad(minuteChunk, 2) +
              " </h2><h3> " +
              value.displayText +
              "</h3> </div></body></html>";

            PopupCenter("#BeHereNow", "Be Here Now", content, 280, 400);
          } else {
            setTimeout(function () {
              alert(value.displayText);
            }, timeIntervalPopupAlert);
          }
        }
      });
    }
  }

  function vibrationNotification() {
    if ($("#checkboxVibration").is(":checked")) {
      try {
        
          window.navigator.vibrate([
            200,
            100,
            200,
            300,
            1000,
            1000,
            200,
            100,
            200,
            300,
          ]);
      
      } catch (error) {
        console.log("Vibration Error", error);
      }
    }
  }

  function close_window() {
    if (confirm("Close Window?")) {
      close();
    }
  }
  $.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.search
    );

    return results !== null ? results[1] || 0 : false;
  };

  // end UTILITY Functions

  //Tracker Functions

  function displayTrackers() {
    $("#errorMessage").html("❀ चेतना: <strong>"+
      $(".radioMind:checked").val()+
        "</strong> ❀ शक्ति: <strong>" +
        $(".radioEnergy:checked").val() +
        "</strong> ❀ कर्म: <strong>" +
        $(".radioWork:checked").val()+"</strong>"
    );
  }

  function setTrackerTime(isLoad) {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    var day = now.getDay(); // 0 Sun, 6 Sat
    let quarter = 4;
    let selEnergy = "L";
    let selWork = "R";

    if (minutes < 45) {
      quarter = 3;
      if (minutes < 30) {
        quarter = 2;
        if (minutes < 15) {
          quarter = 1;
        }
      }
    }
    $("#selectTrackerTime").val(hours + "-" + quarter);

    if (isLoad) {
      if (day === 6 || day === 0) {
        if (hours >= 8 && hours <= 10) {
          selEnergy = "H";
          selWork = "R";
        }
        if (hours >= 11 && hours <= 13) {
          selEnergy = "H";
          selWork = "F";
        }

        if (hours >= 14 && hours <= 17) {
          selEnergy = "M";
          selWork = "C";
        }
        if (hours >= 18 && hours <= 21) {
          selEnergy = "H";
          selWork = "R";
        }
        if (hours === 21 || hours === 22) {
          selEnergy = "H";
          selWork = "C";
        }
      } else {
        if (hours >= 8 && hours <= 16) {
          selEnergy = "M";
          selWork = "W";
        }
        if (hours > 16 && hours < 21) {
          selEnergy = "M";
          selWork = "F";
        }
        if (hours === 21 || hours === 22) {
          selEnergy = "H";
          selWork = "C";
        }

        $("#selectMindA").prop("checked", true);
        $("#radioEnergy"+selEnergy).prop("checked", true);
        $("#radioWork"+selWork).prop("checked", true);
    
        displayTrackers();
      }

    
    }


  }

  function oneClickTracker() {
    setTrackerTime();
    postToGoogle();
  }

  function plusQuarter() {
    let selectedPeriod = $("#selectTrackerTime option:selected")
      .val()
      .split("-");

    let hours = parseInt(selectedPeriod[0]);
    let quarter = parseInt(selectedPeriod[1]);

    if (quarter < 4) {
      quarter++;
    } else {
      hours++;
      quarter = 1;
    }

    $("#selectTrackerTime").val(hours + "-" + quarter);
    $("#success-alert").hide();
  }

  function minusQuarter() {
    let selectedPeriod = $("#selectTrackerTime option:selected")
      .val()
      .split("-");

    let hours = parseInt(selectedPeriod[0]);
    let quarter = parseInt(selectedPeriod[1]);

    if (quarter === 1) {
      hours--;
      quarter = 4;
    } else {
      quarter--;
    }

    $("#selectTrackerTime").val(hours + "-" + quarter);
    $("#success-alert").hide();
  }

  function postToGoogle() {


    $("#progress-loading").show();
    $("#success-alert").hide();
    displayTrackers();

    let apiurl ="https://script.google.com/macros/s/AKfycbxJLoWhDykykVFykQfnvVAwri6wrYwU6xAIrhvOCGOh/dev";
     // "https://script.google.com/macros/s/AKfycbyOlFS1KprVp0UFfsfsjs8ibP-LbX4bnmDgKfy4s1qMUbaL6iLr/exec";

    let selectedPeriod = $("#selectTrackerTime option:selected")
      .val()
      .split("-");
    let paramMind =$(".radioMind:checked").val(); // $("#selectMind option:selected").val();
    let paramEnergy = $(".radioEnergy:checked").val();
    let paramWork = $(".radioWork:checked").val();

    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    var paramtext = "&text=" + hours + "_" + minutes;

    let queryString =
      "?hour=" +
      selectedPeriod[0] +
      "&quarter=" +
      selectedPeriod[1] +
      "&mind=" +
      paramMind +
      "&energy=" +
      paramEnergy +
      "&work=" +
      paramWork;

    console.log("queryString", queryString);

    let googleurl = apiurl + queryString + paramtext + "&callback=?";

    $.ajax({
      crossOrigin: true,
      url: googleurl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log(data);
        let selection =
        paramMind +
          " : " +
          paramEnergy +
          " : " +
          paramWork;

        showAlert(selection + "<h2>" + data + "</h2>");
        console.log("response data", data);
        $("#progress-loading").hide();
      },
      error: function (xhr, error_text, statusText) {
        showAlert(error_text + "<br> Error while Processing");
        console.log("error_text", error_text);
        $("#progress-loading").hide();
      },
    });
  }

  function showAlert(text) {
    $("#alertMessage").html(text);
    $("#success-alert")
      .fadeTo(2000, 1500)
      .slideUp(15000, function () {
        $("#success-alert").slideUp(15000);
      });
  }

  //  Test FUNCTIONS
  function myTestFunction() {}

  // Reusable utility functions

  function getQueryString() {
    let queryString = window.location.href.split("?")[0] + "?";


    queryString += "&timealertmode=" + $("#selectTimeAlertMode").val();
    queryString += "&chunknotifymode=" + $("#selectChunkNotifyMode").val();


    queryString +=
      "&chunkbeforealertaudio=" + $("#selectChunkBeforeAlertAudio").val();


    queryString +=
      "&quartermode=" + ($("#checkboxQuarterMode").is(":checked") ? "1" : "0");
    queryString +=
      "&vibration=" + ($("#checkboxVibration").is(":checked") ? "1" : "0");
    queryString +=
      "&alertpopup=" + ($("#checkboxPopupAlert").is(":checked") ? "1" : "0");
    queryString +=
      "&windowalert=" + ($("#checkboxAlertWindow").is(":checked") ? "1" : "0");
    queryString +=
      "&appon=" + ($("#checkboxAppOnOff").is(":checked") ? "1" : "0");
    queryString += "&openaspopup=1"; //display as popup window

    return queryString;
  }

  function generateQueryString() {
    $("#linkQueryString").html("");
    let queryString = getQueryString();

    $("#linkQueryString").html(queryString);
    $("#linkQueryString").attr("href", queryString);
  }

  function openOpupApp() {
    let cdUrl = getQueryString();

    let newWindow = window.open(cdUrl, "", "width=305,height=580");
  }

  function PopupCenter(url, title, content, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox

    var dualScreenLeft = screen.left; // ;window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = screen.top; //window.screenTop != undefined ? window.screenTop : screen.top;

    width = screen.width; // window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = screen.height; // window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = width / 2 - w / 2; // + dualScreenLeft;
    var top = height / 2 - h / 2; // + dualScreenTop;
    var newWindow = window.open(
      url,
      title,
      "scrollbars=yes, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );

    newWindow.document.write(content);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  }

  function selectChunkNotifyModeOnChange() {
    let audioAlert = $("#audioAlert");

    if ($("#selectChunkNotifyMode").val().indexOf("Chant") >= 0) {
      audioAlert.attr("loop", true);
    } else {
      audioAlert.attr("loop", false);
    }
    if ($("#selectChunkNotifyMode").val().indexOf("Chunk") >= 0) {
      tryChunkClick();
    }
  }

  function selectProfileOnChange(isload) {
    let openaspopup, alertpopup, vibration, quartermode;
    let ischunkbeforealert,
      chunkbeforealertaudio,
      timealertmode,
      chunknotifymode;
    let windowalert = 1;
    let appon = 1;


    if (document.location.search.length && isload) {
      // query string exists

      ischunkbeforealert = $.urlParam("ischunkbeforealert");
      chunkbeforealertaudio = $.urlParam("chunkbeforealertaudio");
      timealertmode = $.urlParam("timealertmode");
      chunknotifymode = $.urlParam("chunknotifymode");

      quartermode = $.urlParam("quartermode");
      vibration = $.urlParam("vibration");
      windowalert = $.urlParam("windowalert");
      alertpopup = $.urlParam("alertpopup");
      openaspopup = $.urlParam("openaspopup");
      appon = $.urlParam("appon");
    } else {
      // no query string exists
      //selectProfileOnChange();
      $.each(__dataProfile, function (index, value) {
        if (value.profileValue === $("#selectProfile").val()) {
          popup = value.popup;

          vibration = value.vibration;
          quartermode = value.quartermode;
          ischunkbeforealert = value.ischunkbeforealert;
          chunkbeforealertaudio = value.chunkbeforealertaudio;
          timealertmode = value.timealertmode;
          chunknotifymode = value.chunknotifymode;

          return false;
        }
      });
    }

    $("#checkboxPopupAlert").prop("checked", alertpopup == 1 ? true : false);
    $("#checkboxAlertWindow").prop("checked", windowalert == 1 ? true : false);
    $("#checkboxAppOnOff").prop("checked", appon == 1 ? true : false);
    $("#checkboxVibration").prop("checked", vibration == 1 ? true : false);
    $("#checkboxQuarterMode").prop("checked", quartermode == 1 ? true : false);

    if (chunkbeforealertaudio > 0)
      $("#selectChunkBeforeAlertAudio").val(chunkbeforealertaudio);

    if (timealertmode) $("#selectTimeAlertMode").val(timealertmode);

    if (chunknotifymode) $("#selectChunkNotifyMode").val(chunknotifymode);


    checkboxAppOnOffChanged();

    if (openaspopup == 1 && window.innerWidth > 500) {
      openOpupApp();
    }

    selectChunkNotifyModeOnChange();

  }

  // ********************* DATA *********************
});

function openUrl(url) {
  window.open(url, "", "width=600,height=800");
}

