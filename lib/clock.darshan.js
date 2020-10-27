$(document).ready(function () {
    //Constants
    const timeIntervalPlayBeforeAlert = 1000;
    const timeIntervalTimePlay = 2000;
    const timeIntervalPopupAlert = 6000;
    const MEDIA_ROOT = "../media/";

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

    // Page_Load EVENTS
    page_Load();

    // FUNCTIONS

    function checkboxAppOnOffChanged() {
        pauseAlertAudio();
        pauseMeditationAudio();

        if ($("#checkboxAppOnOff").is(":checked")) {
            __AppEnabledStatus = setInterval(processBeHereNow, 1000);
            $("#displayNaam").text("Namaste");
            $("#clockContainer").show(500);

            __ClockdarshanStatus = setInterval(function () {
                function r(el, deg) {
                    el.setAttribute("transform", "rotate(" + deg + " 50 50)");
                }
                var d = new Date();
                r(hour, 30 * (d.getHours() % 12) + d.getMinutes() / 2);
                r(min, 6 * d.getMinutes());
            }, 1000);

            //tryMidClick(); // To update display name in silent mode
        } else {
            __CurrentChunk = 0;
            clearInterval(__AppEnabledStatus);
            clearInterval(__ClockdarshanStatus);
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

            if (__alertPlayIndicator !== min - (min % 5) * 60 + sec) {
                //To avoid repeate alert
                if ($("#checkboxQuarterMode").is(":checked")) {
                    if (min % 15 === 0 && sec === 1) {
                        playNotification(true, hours, min);
                        console.log("***** Quarter (15 min) alert at ", timeNow);
                    }
                } else {
                    let chunkNow = fiveChunk === 0 && sec === 1;
                    let midNow = fiveChunk / 2 === 1 && sec === 30;

                    if (chunkNow) {
                        playNotification(true, hours, min);
                        console.log("***** Chunk (5 min) alert at ", timeNow);
                    }
                    if (midNow) {
                        playNotification(false, hours, min - (min % 5));
                        console.log("***** Mid  (2.5 min) alert at ", timeNow);
                    }
                }
            }

            // DisplayText
            displayNameText(min - (min % 5));
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
            selectProfileOnChange();
        });

        // Settings
        $("#selectProfile").on("change", function (event) {
            selectProfileOnChange();
        });

        // Main
        $("#btnTryChunk").on("click", tryChunkClick);
        $("#btnTryMid").on("click", tryMidClick);

        $("#btnBatteryLoader").on("click", loadBatteryFrame);
        $("#btnWaveLoader").on("click", loadWaveFrame);

        //Audio Meditation
        $("#btnPlayMeditationnAudio").on("click", playMeditationAudio);
        $("#btnPauseMeditationAudio").on("click", pauseMeditationAudio);

        $("#checkboxTicker").on("onchange", checkboxTickerChanged);
        $("#selectTickerDuration").on("onchange", checkboxTickerChanged);

        $("#radioMeditationMusic20").on("change", function (event) {
            musicSelected(this.value);
        });

        $("#radioMeditationMusic18Low").on("change", function (event) {
            musicSelected(this.value);
        });
        $("#radioMeditationMusic18").on("change", function (event) {
            musicSelected(this.value);
        });

        //Audio Notifications
        $("#btnChunkBeforeAlertAudioTry").on("click", function (event) {
            testAudioAlert(this);
        });
        $("#btnMidBeforeAlertAudioTry").on("click", function (event) {
            testAudioAlert(this);
        });

        $("#btnTickerAudioTry").on("click", function (event) {
            testAudioAlert(this);
        });

        $("#selectTickerAudio").on("click", tickerAudioChanged);
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
        // Tools
        $("#btnGenerateQueryString").on("click", generateQueryString);
        $("#btnOpenPopupApp").on("click", openOpupApp);
    }

    $("#checkboxAppOnOff").change(checkboxAppOnOffChanged);

    function populateSelectAudioLists() {
        $.each(__dataAudio.alerts, function (index, value) {
            $("#selectChunkBeforeAlertAudio").append(
                $("<option></option>")
                    .attr("value", value.id)
                    .text(value.text)
                    .attr("data-filename", value.fileName)
            );
            $("#selectMidBeforeAlertAudio").append(
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
        $("#selectMidBeforeAlertAudio").prop("selectedIndex", 0);
        $("#selectTickerAudio").prop("selectedIndex", 2);
    }

    function populateProfileLists() {
        $.each(__dataProfile, function (index, value) {
            if (value.selected === 1) {
                $("#selectProfile").append(
                    $("<option selected></option>")
                        .attr("value", value.ProfileValue)
                        .text(value.displayText)
                );
            } else {
                $("#selectProfile").append(
                    $("<option></option>")
                        .attr("value", value.profileValue)
                        .text(value.displayText)
                );
            }
        });
    }

    function populateConfigSelectLists() {
        $.each(__dataConfig.notifyModes, function (index, value) {
            $("#selectChunkNotifyMode").append(
                $("<option></option>").attr("value", value.value).text(value.text)
            );
            $("#selectMidNotifyMode").append(
                $("<option></option>").attr("value", value.value).text(value.text)
            );
        });
    }

    function playNotification(isChunk, hours, minuteChunk, sec) {
        let alertMode;
        __timeInterval = 0;
        __alertPlayIndicator = minuteChunk * 60 + sec;

        if (
            __dataConfig.chunkConfigs === null ||
            __dataConfig.chunkConfigs.length < 1
        ) {
            $("#errorMessage").html(
                $("#errorMessage").html + "Unable to load json data"
            );
            return false;
        }

        if (isChunk) {
            alertMode = $("#selectChunkNotifyMode").val();
        } else {
            alertMode = $("#selectMidNotifyMode").val();
        }

        // 1.Before Alert
        playBeforeAlertAudio(isChunk);

        // 2.Play Time
        if (isChunk) {
            setTimeout(function () {
                playTimeAlert(hours, minuteChunk);
            }, __timeInterval);

            __timeInterval += timeIntervalTimePlay;
        }

        // 3.Play Notification

        if (alertMode !== "Silent") {
            let arrayAlertMode = alertMode.split("_");

            let mediaType = arrayAlertMode[0];
            let cluster = arrayAlertMode[1];

            if (mediaType === "Audio") {
                $.each(__dataAudio.clusterAudios, function (index, value) {
                    if (value.chunk == minuteChunk) {
                        let filename = value[cluster];
                        let volume = value[cluster + "Vol"];

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
                            talkText(textmessage, isEng);
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
        popupAlertChunkName(isChunk, minuteChunk);
        vibrationNotification(isChunk);
    }

    function displayNameText(minuteChunk) {
        // console.log("displayNameText at", minuteChunk, __CurrentChunk);
        if (__CurrentChunk !== minuteChunk) {
            $.each(__dataConfig.chunkConfigs, function (index, value) {
                if (minuteChunk === value.chunk) {
                    $("#displayNaam").html(value.displayText);
                    __CurrentChunk = minuteChunk;
                    document.title = value.displayText;
                }
            });
        }
    }

    function playTimeAlert(hours, minuteChunk) {
        let mode = $("#selectTimeAlertMode").val();

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
                console.log(
                    "playTimeAlert() for timeText ",
                    timeText,
                    " minuteChunk:",
                    minuteChunk
                );
            }

            // timeInterval += timeIntervalTimePlay;
            console.log("Time Played at time:", hours + ":" + minuteChunk);
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
                console.log("Ticker Audio played at Ticker State:", __tickerState);
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
        playNotification(true, hours, min - (min % 5));
    }

    function tryMidClick() {
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
        u.volume = $("#rangeSpeechVolume").val(); // 0 to 1

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

    function playChunkBeforeAlert() {
        let timeBeforeText = "";
        if ($("#checkboxChunkBeforeAlert").val() != "None") {
            if ($("#checkboxChunkBeforeAlert").val() == "Audio") {
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

        console.log("playTimeAudioAlert() for ", number);
    }

    function tickerAudioChanged(control) {
        let audioTicker = $("#audioTicker");

        let fileName = MEDIA_ROOT + "alerts/" + control.value;

        console.log("Ticker audio changed to ", fileName);

        audioTicker.attr("src", fileName);
    }

    function playNotificationAudio(minuteChunk, fileName, trackVolume) {
        let audioAlert = $("#audioAlert");
        let setVolume = $("#rangeAlertAudioVolume")[0].value;
        let volume = 0;

        if (setVolume) {
            volume = setVolume;
        }

        if (trackVolume) {
            volume = volume * trackVolume;
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
        let controlId = id.id.replace("Try", "").replace("btn", "");

        let fileName = $("#select" + controlId)
            .find(":selected")
            .data("filename");

        audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
        // alert($("#" + controlId).find(':selected').data('volume'));

        audioAlert[0].play();
    }

    function playBeforeAlertAudio(isChunk) {
        let play = false;
        let fileName = "";

        if (isChunk) {
            if ($("#checkboxChunkBeforeAlert").is(":checked")) {
                play = true;
                fileName = $("#selectChunkBeforeAlertAudio")
                    .find(":selected")
                    .data("filename");
            }
        } else {
            if ($("#checkboxMidBeforeAlert").is(":checked")) {
                play = true;
                fileName = $("#selectMidBeforeAlertAudio")
                    .find(":selected")
                    .data("filename");
            }

            console.log("playBeforeAlertAudio() for isChunk:", isChunk);
        }

        if (play) {
            // do something
            let audioAlert = $("#audioAlert");

            if (fileName) {
                audioAlert.attr("src", MEDIA_ROOT + "alerts/" + fileName);
                audioAlert[0].play();
                ////Todo volume
                __timeInterval += timeIntervalPlayBeforeAlert;
            } else {
                $("#errorMessage").html(
                    $("#errorMessage").html +
                    "Alert File missing error isChunk: " +
                    isChunk
                );
            }
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
        $("#rangeAlertAudioVolumeLabel").text(parseInt(value * 100) + "%");
    }

    function setTickerAudioVolume(value) {
        $("#audioTicker").volume = value;
        $("#rangeTickerVolumeLabel").text(parseInt(value * 100) + "%");
    }

    function setMeditationMusicVolume(value) {
        $("#audioMeditation").volume = value;
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
        debugger;
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

    function popupAlertChunkName(isChunk, minuteChunk) {
        if (isChunk && $("#checkboxPopupAlert").is(":checked")) {
            $.each(__dataConfig.chunkConfigs, function (index, value) {
                if (minuteChunk === value.chunk) {
                    if ($("#checkboxAlertWindow").is(":checked")) {
                        let windowPop = window.open(
                            "",
                            "Be Here Now",
                            "width=280,height=100"
                        );
                        windowPop.document.write(
                            "<html><head><title>Be Here Now</title><style>body{background-color:#FA9207;font-family:Verdana; text-align:center;  color: aliceblue;}</style></head><body>" +
                            "<h2>" +
                            pad(minuteChunk, 2) +
                            " </h2><h3> " +
                            value.displayText +
                            "</h3>" +
                            "</body></html>"
                        );
                    } else {
                        setTimeout(function () {
                            alert(value.displayText);
                        }, timeIntervalPopupAlert);
                    }
                }
            });
        }
    }

    function vibrationNotification(isChunk) {
        if ($("#checkboxVibration").is(":checked")) {
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
    function myTestFunction() { }

    // Reusable utility functions

    function generateQueryString() {
        $("#linkQueryString").html("");
        let queryString = window.location.href.split("?")[0] + "?";

        queryString +=
            "popup=" + ($("#checkboxPopupAlert").is(":checked") ? "1" : "0");
        queryString +=
            "&vibration=" + ($("#checkboxVibration").is(":checked") ? "1" : "0");
        queryString +=
            "&quartermode=" + ($("#checkboxQuarterMode").is(":checked") ? "1" : "0");

        queryString +=
            "&ischunkbeforealert=" +
            ($("#checkboxChunkBeforeAlert").is(":checked") ? "1" : "0");

        queryString += "&timealertmode=" + $("#selectTimeAlertMode").val();
        queryString += "&chunknotifymode=" + $("#selectChunkNotifyMode").val();

        queryString +=
            "&ismidbeforealert=" +
            ($("#checkboxMidBeforeAlert").is(":checked") ? "1" : "0");

        queryString += "&midnotifymode=" + $("#selectMidNotifyMode").val();

        queryString +=
            "&chunkbeforealertaudio=" + $("#selectChunkBeforeAlertAudio").val();
        queryString +=
            "&midbeforealertaudio=" + $("#selectMidBeforeAlertAudio").val();

        $("#linkQueryString").html(queryString);
        $("#linkQueryString").attr("href", queryString);
    }

    function openOpupApp() {
        let newWindow = window.open(
            window.location.href.split("?")[0],
            "",
            "width=305,height=580"
        );
    }

    function selectProfileOnChange() {
        let popup, vibration, quartermode;
        let ischunkbeforealert,
            chunkbeforealertaudio,
            timealertmode,
            chunknotifymode;

        let ismidbeforealert, midbeforealertaudio, midnotifymode;

        if (document.location.search.length) {
            // query string exists

            popup = $.urlParam("popup");
            vibration = $.urlParam("vibration");
            quartermode = $.urlParam("quartermode");
            ischunkbeforealert = $.urlParam("ischunkbeforealert");
            chunkbeforealertaudio = $.urlParam("chunkbeforealertaudio");
            timealertmode = $.urlParam("timealertmode");
            chunknotifymode = $.urlParam("chunknotifymode");

            ismidbeforealert = $.urlParam("ismidbeforealert");
            midbeforealertaudio = $.urlParam("midbeforealertaudio");
            midnotifymode = $.urlParam("midnotifymode");
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

                    ismidbeforealert = value.ismidbeforealert;
                    midbeforealertaudio = value.midbeforealertaudio;
                    midnotifymode = value.midnotifymode;

                    return false;
                }
            });
        }

        $("#checkboxPopupAlert").prop("checked", popup == 1 ? true : false);
        $("#checkboxVibration").prop("checked", vibration == 1 ? true : false);
        $("#checkboxQuarterMode").prop("checked", quartermode == 1 ? true : false);

        $("#checkboxChunkBeforeAlert").prop(
            "checked",
            ischunkbeforealert == 1 ? true : false
        );

        if (chunkbeforealertaudio > 0)
            $("#selectChunkBeforeAlertAudio").val(chunkbeforealertaudio);

        if (timealertmode) $("#selectTimeAlertMode").val(timealertmode);

        if (chunknotifymode) $("#selectChunkNotifyMode").val(chunknotifymode);

        $("#checkboxMidBeforeAlert").prop(
            "checked",
            ismidbeforealert == 1 ? true : false
        );
        if (midbeforealertaudio > 0) {
            $("#selectMidBeforeAlertAudio").val(midbeforealertaudio);
        }

        if (midnotifymode) $("#selectMidNotifyMode").val(midnotifymode);

        /*
          for (let i = 0; i < __dataProfile.length; i++) {
            if (__dataProfile[i].ProfileValue === $("#selectProfile").val()) {
              $("#checkboxPopupAlert").is(":checked") =
                __dataProfile[i].PopupAlertEnabled === 1 ? true : false;
              $("#checkboxVibration").is(":checked") =
                __dataProfile[i].VibrationEnabled === 1 ? true : false;
              $("#checkboxQuarterMode").is(":checked") =
                __dataProfile[i].QuarterEnabled === 1 ? true : false;
              $("#checkboxChunkBeforeAlert").is(":checked") =
                __dataProfile[i].ChunkBeforeAlertEnabled === 1 ? true : false;
              $("#selectChunkBeforeAlertAudio").val() = __dataProfile[
                i
              ].ChunkBeforeAlertAudio;
              $("#selectTimeAlertMode").val() = __dataProfile[i].TimeAlert;
              $("#selectChunkNotifyMode").val() = __dataProfile[i].ChunkNotifyMode;
              $("#controlChunkTextSpeakMode").val() = __dataProfile[
                i
              ].ChunkTextSpeakMode;
              $("#checkboxMidBeforeAlert").is(":checked") =
                __dataProfile[i].MidBeforeAlertEnabled === 1 ? true : false;
              $("#selectMidBeforeAlertAudio").val() = __dataProfile[
                i
              ].MidBeforeAlertAudio;
              $("#checkboxPopupAlert").is(":checked") =
                __dataProfile[i].PopupAlertEnabled === 1 ? true : false;
      
              $("#selectMidNotifyMode").val() = __dataProfile[i].MidNotifyMode;
              $("#controlMidTextSpeakMode").val() = __dataProfile[i].MidTextSpeakMode;
      
              //
            }
          }
      */
        setSpeechVolume(0.7);
        setAlertAudioVolume(0.5);
        setMeditationMusicVolume(0.8);
        pauseAlertAudio();
        pauseMeditationAudio();
    }

    // ********************* DATA *********************
});
