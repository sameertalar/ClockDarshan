$(document).ready(function () {
  var __tickerState = 0;
  var __CurrentChunk = 0;
  var _AppEnabledStatus = false;
  var _ClockdarshanStatus = false;
  const timeIntervalAlertPlay = 500;
  const timeIntervalTimePlay = 2000;
  const timeIntervalPopupAlert = 4000;
  const MEDIA_ROOT = "../media/";
  var __dataConfig = [];
  var __dataAudio = [];
  var __dataProfile = [];

  // Page_Load EVENTS
  page_Load();

  // FUNCTIONS

  function controlAppEnabledChanged() {
    pauseAlertAudio();
    pauseMeditationAudio();

    if ($("#controlAppEnabled").is(":checked")) {
      _AppEnabledStatus = setInterval(processBeHereNow, 1000);
      $("#displayNaam").text("Namaste");
      $("#clockContainer").show(500);

      _ClockdarshanStatus = setInterval(function () {
        function r(el, deg) {
          el.setAttribute("transform", "rotate(" + deg + " 50 50)");
        }
        var d = new Date();

        r(min, 6 * d.getMinutes());
      }, 1000);

      //demoMidClick(); // To update display name in silent mode
    } else {
      clearInterval(_AppEnabledStatus);
      clearInterval(_ClockdarshanStatus);
      $("#currentTime").text("Be Here Now");
      $("#displayNaam").text("|| APP PAUSED ||");
      document.title = "Be Here Now";
      $("#clockContainer").hide(500);
      pauseVideo();
    }
  }

  function processBeHereNow() {
    try {
      let now = new Date();
      let hours = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();

      // show Current Time
      showCurrentTime(hours, min, sec);

      // Time Elaspe Progress
      showTimeElaspeProgress(min, sec);

      //Ticker Ticking
      tickerTick();

      // Auto Turn Off App
      autoTurnOffApp(hours, min, sec);

      let fiveChunk = min % 5;
      let timeNow = hours + ":" + min + ":" + sec;

      // DisplayText
      displayNameText(min - (min % 5));

      if (fiveChunk === 0 && sec === 1) {
        playNotification(true, hours, min);
        console.log("Chunk (5 min) alert at ", timeNow);
      }
      if (fiveChunk / 2 === 1 && sec === 30) {
        playNotification(false, hours, min - (min % 5));
        console.log("Mid  (2.5 min) alert at ", timeNow);
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html(
        $("#errorMessage").html + "Unhandled Error: " + error
      );
    }
  }

  function page_Load() {
    $.getJSON("data/config.json", function (data) {
      __dataConfig = data;
    });

    $.getJSON("data/audio.json", function (data) {
      __dataAudio = data;
      populateSelectLists();
    });
    $.getJSON("data/profile.json", function (data) {
      __dataProfile = data;
      populateProfileLists();
      controlProfileOnChange();
    });

    $("#contentBattery").on("click", loadBatteryFrame);
    $("#batteryLoadBtn").on("click", loadBatteryFrame);
    $("#speakChunkBtn").on("click", demoChunkClick);
    $("#speakMidhBtn").on("click", demoMidClick);

    $("#waveLoadBtn").on("click", loadWaveFrame);
    $("#batteryLxoadBtn").on("click", loadBatteryFrame); //???
    $("#btnPlayMeditationnAudio").on("click", playMeditationAudio);
    $("#btnPauseMeditationAudio").on("click", pauseMeditationAudio);
    $("#btnGenerateQueryString").on("click", generateQueryString);

    $("#controlAudioChunk00test").on("click", testAudioAlert); // Repeate for all

    $("#controlAudioMid00test").on("click", testAudioAlert); // Repeate for all

    $("#controlChunkTextSpeakMode").on(
      "click",
      controlChunkTextSpeakModeOnChange
    );

    $("#controlChunkBeforeAlertAudiotest").on("click", function (event) {
      testAudioAlert(this);
    });
    $("#controlMidBeforeAlertAudiotest").on("click", function (event) {
      testAudioAlert(this);
    });

    $("#controlTickerAudiotest").on("click", function (event) {
      testTickerAudio(this);
    });

    $("#controlTickerAudio").on("click", tickerAudioChanged);
    $("#btnPauseAllAudios").on("click", pauseAllAudios);

    $("#controlTimeAlertMode").on("onchange", controlMidTextSpeakModeOnChange);

    $("#controlChunkNotifyMode").on(
      "onchange",
      controlMidTextSpeakModeOnChange
    );

    $("#controlMidNotifyMode").on("onchange", controlMidTextSpeakModeOnChange);
    $("#controlMidTextSpeakMode").on(
      "onchange",
      controlMidTextSpeakModeOnChange
    );
    $("#controlTickerEnabled").on("onchange", controlTickerEnabledChanged);
    $("#controlTickerDuration").on("onchange", controlTickerEnabledChanged);

    $("#controlMusicRadio20").on("change", function (event) {
      musicSelected(this.value);
    });

    $("#controlMusicRadio18Low").on("change", function (event) {
      musicSelected(this.value);
    });
    $("#controlMusicRadio18").on("change", function (event) {
      musicSelected(this.value);
    });
    $("#controlMusicVolumn").on("change", function (event) {
      setMeditationMusicVolume(this.value);
    });
    $("#controlAlertAudioVolume").on("change", function (event) {
      setAlertAudioVolume(this.value);
    });
    $("#controlSpeechVolume").on("change", function (event) {
      setSpeechVolume(this.value);
    });
    $("#controlTickerVolume").on("change", function (event) {
      setTickerAudioVolume(this.value);
    });
    $("#controlProfile").on("change", function (event) {
      controlProfileOnChange();
    });
    //
  }

  $("#controlAppEnabled").change(controlAppEnabledChanged);

  function populateSelectLists() {
    for (let i = 0; i < __dataAudio.length; i++) {
      let suffix = __dataAudio[i].forChunk === 1 ? "Chunk" : "Mid";

      if (__dataAudio[i].selChunk === 1 || __dataAudio[i].selInt === 1) {
        $("#controlAudio" + suffix + pad(__dataAudio[i].chunk, 2)).append(
          $("<option selected></option>")
            .attr("value", __dataAudio[i].fileName)
            .attr("data-volume", 0.8)
            .text(__dataAudio[i].fileTitle)
        );
      } else {
        $("#controlAudio" + suffix + pad(__dataAudio[i].chunk, 2)).append(
          $("<option></option>")
            .attr("value", __dataAudio[i].fileName)
            .attr("data-volume", 0.8)
            .text(__dataAudio[i].fileTitle)
        );
      }
    }
  }

  function populateProfileLists() {
    $.each(__dataProfile, function (index, value) {
      if (value.selected === 1) {
        $("#controlProfile").append(
          $("<option selected></option>")
            .attr("value", value.ProfileValue)
            .text(value.displayText)
        );
      } else {
        $("#controlProfile").append(
          $("<option></option>")
            .attr("value", value.profileValue)
            .text(value.displayText)
        );
      }
    });
  }

  function playNotification(isChunk, hours, minuteChunk) {
    let alertMode;
    if (__dataConfig === null || __dataConfig.length < 1) {
      $("#errorMessage").html(
        $("#errorMessage").html + "Unable to load json data"
      );
    }
    if (isChunk) {
      alertMode = $("#controlChunkNotifyMode").val();
    } else {
      alertMode = $("#controlMidNotifyMode").val();
    }

    for (let i = 0; i < __dataConfig.length; i++) {
      if (minuteChunk === __dataConfig[i].chunk) {
        $("#displayNaam").html(__dataConfig[i].NaamText);

        let timeInterval = 0;

        // Before Alert
        timeInterval = playBeforeAlertAudio(isChunk, timeInterval);

        // Play Time
        if (isChunk) {
          setTimeout(function () {
            playTimeAlert(hours, minuteChunk, timeInterval);
          }, timeInterval);

          timeInterval += timeIntervalTimePlay;
        }

        // Play Notification

        switch (alertMode) {
          case "Audio":
            setTimeout(function () {
              playAlertNotification(isChunk, minuteChunk);
            }, timeInterval);

            break;

          case "Text":
            let controlMode;
            if (isChunk) {
              controlMode = $("#controlChunkTextSpeakMode").val();
            } else {
              controlMode = $("#controlMidTextSpeakMode").val();
            }

            //Todo
            textmessage = __dataConfig[i][controlMode + "Text"];

            let isEng =
              __dataConfig[i][controlMode + "Lang"] > "eng" ? false : true;

            setTimeout(function () {
              talkText(textmessage, isEng);
            }, timeInterval);
            break;

          default:
          // "Silent":
          // No Action
        }

        // Misc
        popupAlertChunkName(isChunk, __dataConfig[i].NaamText);
        vibrationNotification(isChunk);
      }
    }
  }

  function displayNameText(minuteChunk) {
    // console.log("displayNameText at", minuteChunk, __CurrentChunk);
    if (__CurrentChunk !== minuteChunk) {
      $.each(__dataConfig, function (index, value) {
        if (minuteChunk === value.chunk) {
          $("#displayNaam").html(value.NaamText);
          __CurrentChunk = minuteChunk;
          document.title = value.NaamText;
        }
      });
    }
  }

  function playTimeAlert(hours, minuteChunk, timeInterval) {
    let mode = $("#controlTimeAlertMode").val();

    if (mode !== "Silent") {
      let hrs = hours % 12;
      let timeText = "Time ";

      if (hrs === 0) hrs = 12;
      timeText += " " + hrs + " ";
      if (minuteChunk === 0) timeText += hours > 12 ? "PM" : "AM";

      if (minuteChunk > 0) timeText += minuteChunk;

      if (mode === "Audio") {
        //
        playTimeAudioAlert(hrs);

        setTimeout(function () {
          playTimeAudioAlert(minuteChunk);
        }, 1000);
      }

      if (mode === "Text") {
        //Text-2-Speech
        talkText(timeText, true);
      }

      // timeInterval += timeIntervalTimePlay;
      console.log("Time Played at time:", hours + ":" + minuteChunk);
    }

    return timeInterval;
  }

  // ******* TIME Functions *******
  function showCurrentTime(hours, min, sec) {
    let hrs = hours % 12;
    var timeNow =
      (hrs === 0 ? "12" : pad(hrs, 2)) +
      ":" +
      pad(min, 2) +
      ":" +
      pad(sec, 2) +
      " " +
      (hours > 12 ? "PM" : "AM");
    $("#currentTime").text(timeNow);
  }

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
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

  function controlTickerEnabledChanged() {
    __tickerState = 0;
  }

  function tickerTick() {
    if ($("#controlTickerEnabled").is(":checked")) {
      if (__tickerState == parseInt($("#controlTickerDuration").val())) {
        console.log("Ticker Audio played at Ticker State:", __tickerState);
        // play audio;
        $("#audioTicker")[0].play();
        __tickerState = 0;
      }
      __tickerState++;
    }
  }

  function autoTurnOffApp(hours, min, sec) {
    if ($("#controlAutoOffEnabled").is(":checked")) {
      let timeSelected = $("#controlAutoOffTime").val();

      if (
        new Date("1/1/2020 " + hours + ":" + min + ":" + sec) >
        new Date("1/1/2020 " + timeSelected + ":00")
      ) {
        console.log("OFF Time  at ", timeSelected);
        $("#controlAppEnabled").is(":checked") = false;
        controlAppEnabledChanged();
      }
    }
  }

  // end TIME Functions

  // ******* Demo Functions *******
  function demoChunkClick() {
    let now = new Date();
    let min = now.getMinutes();
    let hours = now.getHours();
    playNotification(true, hours, min - (min % 5));
  }

  function demoMidClick() {
    let now = new Date();
    let min = now.getMinutes();
    let hours = now.getHours();
    playNotification(false, hours, min - (min % 5));

    playVideo();
  }

  // end Demo Functions

  // ******* SPEECH Functions *******

  function talkText(text, isEng) {
    let u = new SpeechSynthesisUtterance();
    u.text = text;
    u.volume = $("#controlSpeechVolume").val(); // 0 to 1

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
    $("#controlSpeechVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function playChunkBeforeAlert() {
    let timeBeforeText = "";
    if ($("#controlChunkBeforeAlertEnabled").val() != "None") {
      if ($("#controlChunkBeforeAlertEnabled").val() == "Audio") {
        playAlertAudio(true);
      } //Text
      else {
        timeBeforeText = $("#controlChunkBeforeText").val();
      }
    }

    if ($("#controlSpeakTimeEnabled").is(":checked") == true) {
      setTimeout(function () {
        speakTimeText(timeBeforeText);
      }, 1000);
    }
  }

  function playMidBeforeAlert() {
    if ($("#controlIntBeforeAlert").val() != "None") {
      let beforeText = "";
      if ($("#controlIntBeforeAlert").val() == "Audio") {
        playAlertAudio(false);
      } //Text
      else {
        beforeText = $("#controlMidBeforeText").val();
        talkText(beforeText, true);
      }
    }
  }

  // end SPEECH Functions

  // ******* MEDIA Functions *******

  function playTimeAudioAlert(number) {
    let audioAlert = $("#audioAlert");

    if (number !== 0) {
      let fileName = MEDIA_ROOT + "numbers/_number_" + number + ".mp3";
      audioAlert.attr("src", fileName);
      audioAlert[0].play();
    } else {
      //todo am/pm
    }
  }

  function tickerAudioChanged(control) {
    let audioTicker = $("#audioTicker");

    let fileName = MEDIA_ROOT + "alerts/" + control.value;

    console.log("Ticker audio changed to ", fileName);

    audioTicker.attr("src", fileName);
  }

  function playAlertNotification(isChunk, minuteChunk) {
    let audioAlert = $("#audioAlert");

    let controlName = "#controlAudio";

    controlName += isChunk ? "Chunk" : "Mid";

    controlName += pad(minuteChunk, 2);

    let fileName = $(controlName).val();
    audioAlert.attr("src", MEDIA_ROOT + "audios/" + fileName);

    audioAlert[0].play();

    console.log("Audio Played ", fileName, " isChunk:", isChunk);
  }

  function testAudioAlert(id) {
    let audioAlert = $("#audioAlert");
    let controlId = id.id.replace("test", "");
    let fileName = $("#" + controlId).val();

    audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
    // alert($("#" + controlId).find(':selected').data('volume'));

    audioAlert[0].play();
  }

  function testTickerAudio(id) {
    let audioTicker = $("#audioTicker");
    let controlId = id.id.replace("test", "");
    let fileName = $("#" + controlId).val();

    audioTicker.attr("src", MEDIA_ROOT + "audios/" + fileName);
    audioTicker[0].play();
  }

  function playBeforeAlertAudio(isChunk, timeInterval) {
    let play = false;
    let fileName = "";

    if (isChunk) {
      if ($("#controlChunkBeforeAlertEnabled").is(":checked")) {
        play = true;
        fileName = $("#controlChunkBeforeAlertAudio").val();
      }
    } else {
      if ($("#controlMidBeforeAlertEnabled").is(":checked")) {
        play = true;
        fileName = $("#controlMidBeforeAlertAudio").val();
      }
    }

    if (play) {
      // do something
      let audioAlert = $("#audioAlert");
      if (fileName !== "None") {
        audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
        audioAlert[0].play();
        timeInterval += timeIntervalAlertPlay;
      }
    }

    return timeInterval;
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
    } catch (error) {
      $("#errorMessage").html(
        $("#errorMessage").html + "pauseAllAudios Error" + error
      );
      console.log("pauseAllAudios Error", error);
    }
  }

  function playVideo() {
    try {
      $("#videoDummy").volume = 0;
      $("#videoDummy")[0].play();
      console.log("Video Playing Started....");
    } catch (err) {
      $("#errorMessage").html(
        $("#errorMessage").html + "Video playing failed! " + err
      );
      console.log("Video playing failed! ", err);
    }
  }

  function pauseVideo() {
    $("#videoDummy")[0].pause();
  }

  function setAlertAudioVolume(value) {
    $("#audioAlert").volume = value;
    $("#controlAlertAudioVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function setTickerAudioVolume(value) {
    $("#audioTicker").volume = value;
    $("#controlTickerVolumeLabel").text(parseInt(value * 100) + "%");
  }

  function setMeditationMusicVolume(value) {
    $("#audioMeditation").volume = value;
    $("#controlMusicVolumnLabel").text(parseInt(value * 100) + "%");
  }

  function pauseAlertAudio() {
    $("#audioAlert")[0].pause();
  }

  // end MEDIA Functions
  // ******* UTILITY Functions *******

  function loadWaveFrame() {
    if ($("#contentFrame").is(":visible")) {
      $("#frameWave").attr("src", "");
      $("#contentFrame").hide(500);
    } else {
      $("#frameWave").attr("src", "component/wave.html");
      $("#contentFrame").show(500);
    }
  }

  function loadBatteryFrame() {
    if ($("#contentBattery").is(":visible")) {
      $("#frameBattery").attr("src", "");
      $("#contentBattery").hide(500);
    } else {
      $("#frameBattery").attr("src", "component/breathbattery.html");

      $("#contentBattery").show(500);
    }
  }

  function popupAlertChunkName(isChunk, showText) {
    if (isChunk && $("#controlPopupAlertEnabled").is(":checked")) {
      setTimeout(function () {
        alert(showText);
      }, timeIntervalPopupAlert);
    }
  }

  function vibrationNotification(isChunk) {
    if ($("#controlVibrationEnabled").is(":checked")) {
      try {
        if (isChunk) {
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
            1000,
            1000,
            200,
            100,
            200,
            300,
            1000,
          ]);
        } else {
          window.navigator.vibrate([2000]);
        }
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
  //  Test FUNCTIONS
  function myTestFunction() {}

  // Reusable utility functions

  function controlChunkTextSpeakModeOnChange() {
    //None
  }

  function controlMidTextSpeakModeOnChange() {
    //None
  }

  function generateQueryString() {
    $("#linkQueryString").html("");
    let queryString = window.location.href + "?";

    queryString +=
      "popup=" + ($("#controlPopupAlertEnabled").is(":checked") ? "1" : "0");
    queryString +=
      "&vibration=" +
      ($("#controlVibrationEnabled").is(":checked") ? "1" : "0");
    queryString +=
      "&quartermode=" +
      ($("#controlQuarterEnabled").is(":checked") ? "1" : "0");

    queryString +=
      "&ischunkbeforealert=" +
      ($("#controlChunkBeforeAlertEnabled").is(":checked") ? "1" : "0");
    queryString +=
      "&chunkbeforealertaudio=" + $("#controlChunkBeforeAlertAudio").val();
    queryString += "&timealertmode=" + $("#controlTimeAlertMode").val();
    queryString += "&chunknotifymode=" + $("#controlChunkNotifyMode").val();
    queryString += "&chunktextmode=" + $("#controlChunkTextSpeakMode").val();

    queryString +=
      "&ismidbeforealert=" +
      ($("#controlMidBeforeAlertEnabled").is(":checked") ? "1" : "0");
    queryString +=
      "&midbeforealertaudio=" + $("#controlMidBeforeAlertAudio").val();
    queryString += "&midnotifymode=" + $("#controlMidNotifyMode").val();
    queryString += "&midtextmode=" + $("#controlMidTextSpeakMode").val();

    $("#linkQueryString").html("Copy Link");
    $("#linkQueryString").attr("href", queryString);
  }

  function controlProfileOnChange() {
    let popup, vibration, quartermode;
    let ischunkbeforealert,
      chunkbeforealertaudio,
      timealertmode,
      chunknotifymode,
      chunktextmode;
    let ismidbeforealert, midbeforealertaudio, midnotifymode, midtextmode;

    if (document.location.search.length) {
      // query string exists

      popup = $.urlParam("popup");
      vibration = $.urlParam("vibration");
      quartermode = $.urlParam("quartermode");
      ischunkbeforealert = $.urlParam("ischunkbeforealert");
      chunkbeforealertaudio = $.urlParam("chunkbeforealertaudio");
      timealertmode = $.urlParam("timealertmode");
      chunknotifymode = $.urlParam("chunknotifymode");
      chunktextmode = $.urlParam("chunktextmode");

      ismidbeforealert = $.urlParam("ismidbeforealert");
      midbeforealertaudio = $.urlParam("midbeforealertaudio");
      midnotifymode = $.urlParam("midnotifymode");
      midtextmode = $.urlParam("midtextmode");
    } else {
      // no query string exists
      //controlProfileOnChange();
      $.each(__dataProfile, function (index, value) {
        if (value.profileValue === $("#controlProfile").val()) {
          popup = value.popup;
          vibration = value.vibration;
          quartermode = value.quartermode;
          ischunkbeforealert = value.ischunkbeforealert;
          chunkbeforealertaudio = value.chunkbeforealertaudio;
          timealertmode = value.timealertmode;
          chunknotifymode = value.chunknotifymode;
          chunktextmode = value.chunktextmode;
          ismidbeforealert = value.ismidbeforealert;
          midbeforealertaudio = value.midbeforealertaudio;
          midnotifymode = value.midnotifymode;
          midtextmode = value.midtextmode;
          return false;
        }
      });
    }

    $("#controlPopupAlertEnabled").prop("checked", popup == 1 ? true : false);
    $("#controlVibrationEnabled").prop(
      "checked",
      vibration == 1 ? true : false
    );
    $("#controlQuarterEnabled").prop(
      "checked",
      quartermode == 1 ? true : false
    );

    $("#controlChunkBeforeAlertEnabled").prop(
      "checked",
      ischunkbeforealert == 1 ? true : false
    );
    $("#controlChunkBeforeAlertAudio").val(chunkbeforealertaudio);
    $("#controlTimeAlertMode").val(timealertmode);
    $("#controlChunkNotifyMode").val(chunknotifymode);
    $("#controlChunkTextSpeakMode").val(chunktextmode);

    $("#controlMidBeforeAlertEnabled").prop(
      "checked",
      ismidbeforealert == 1 ? true : false
    );
    $("#controlMidBeforeAlertAudio").val(midbeforealertaudio);
    $("#controlMidNotifyMode").val(midnotifymode);
    $("#controlMidTextSpeakMode").val(midtextmode);

    /*
    for (let i = 0; i < __dataProfile.length; i++) {
      if (__dataProfile[i].ProfileValue === $("#controlProfile").val()) {
        $("#controlPopupAlertEnabled").is(":checked") =
          __dataProfile[i].PopupAlertEnabled === 1 ? true : false;
        $("#controlVibrationEnabled").is(":checked") =
          __dataProfile[i].VibrationEnabled === 1 ? true : false;
        $("#controlQuarterEnabled").is(":checked") =
          __dataProfile[i].QuarterEnabled === 1 ? true : false;
        $("#controlChunkBeforeAlertEnabled").is(":checked") =
          __dataProfile[i].ChunkBeforeAlertEnabled === 1 ? true : false;
        $("#controlChunkBeforeAlertAudio").val() = __dataProfile[
          i
        ].ChunkBeforeAlertAudio;
        $("#controlTimeAlertMode").val() = __dataProfile[i].TimeAlert;
        $("#controlChunkNotifyMode").val() = __dataProfile[i].ChunkNotifyMode;
        $("#controlChunkTextSpeakMode").val() = __dataProfile[
          i
        ].ChunkTextSpeakMode;
        $("#controlMidBeforeAlertEnabled").is(":checked") =
          __dataProfile[i].MidBeforeAlertEnabled === 1 ? true : false;
        $("#controlMidBeforeAlertAudio").val() = __dataProfile[
          i
        ].MidBeforeAlertAudio;
        $("#controlPopupAlertEnabled").is(":checked") =
          __dataProfile[i].PopupAlertEnabled === 1 ? true : false;

        $("#controlMidNotifyMode").val() = __dataProfile[i].MidNotifyMode;
        $("#controlMidTextSpeakMode").val() = __dataProfile[i].MidTextSpeakMode;

        //
      }
    }
*/
    setAlertAudioVolume(0.8);
    setMeditationMusicVolume(0.8);
    pauseAlertAudio();
    pauseMeditationAudio();
  }

  // ********************* DATA *********************
});
