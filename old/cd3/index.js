$(document).ready(function () {
  var __AppEnabledStatus = false;
  var __ClockdarshanStatus = false;
  var __ApiCallStatus = false;

  const _UpdaterApiUrl =
    "https://script.google.com/macros/s/AKfycbx76d72NhLVCnZdIlDioIeqclF5430ZuSUNc9648mY/dev";
  const _ResetApiUrl =
    "https://script.google.com/macros/s/AKfycbxMDdF3Z8lJyZ2aA5BiBVzZWlvNIxglS9L4zqJ8cpzB/dev";

  var _Tracks = [];

  const _gods = [
    "गणेश",
    "महाराज",
    "दुर्गा",
    "शंकर",
    "महालक्ष्मी",
    "अन्नपूर्णा",
    "हनुमान",
    "रमण म.",
    "सरस्वती",
    "नर्मदा",
    "बुद्ध",
    "कृष्ण",
  ];

  const _configs = [
    {
      type: "Mind",
      item: "M5",
      column: "C",
      icon: "🕊️",
      faClass: "fa fa-paper-plane text-success",
    },
    {
      type: "Mind",
      item: "M4",
      column: "D",
      icon: "🧘",
      faClass: "fa fa-user-circle text-primary",
    },
    {
      type: "Mind",
      item: "M3",
      column: "E",
      icon: "👁️",
      faClass: "fa fa-eye text-warning",
    },
    {
      type: "Mind",
      item: "M2",
      column: "F",
      icon: "🎳",
      faClass: "fa fa-eye-slash tet-dark",
    },
    {
      type: "Mind",
      item: "M1",
      column: "G",
      icon: "🔥",
      faClass: "fa fa-fire text-danger",
    },
    {
      type: "Energy",
      item: "E3",
      column: "I",
      icon: "🔋",
      faClass: "fa fa-star text-success",
    },
    {
      type: "Energy",
      item: "E2",
      column: "J",
      icon: "🥥",
      faClass: "fa fa-star-half-o text-warning",
    },
    {
      type: "Energy",
      item: "E1",
      column: "K",
      icon: "☆",
      faClass: "fa fa fa-star-o text-danger",
    },
    {
      type: "Work",
      item: "W5",
      column: "M",
      icon: "🪔",
      faClass: "fa fa-eercast text-info",
    },
    {
      type: "Work",
      item: "W4",
      column: "N",
      icon: "💎",
      faClass: "fa fa-diamond text-primary",
    },
    {
      type: "Work",
      item: "W3",
      column: "O",
      icon: "🌿",
      faClass: "fa fa-envira text-success",
    },
    {
      type: "Work",
      item: "W2",
      column: "P",
      icon: "👪",
      faClass: "fa fa-life-ring fa-spin text-warning",
    },
    {
      type: "Work",
      item: "W1",
      column: "Q",
      icon: "🍂",
      faClass: "fa fa-ban text-danger",
    },
    {
      type: "Sleep",
      item: "S",
      column: "S",
      icon: "😴",
      faClass: "fa fa-bed text-secondary",
    },
    {
      type: "Missed",
      item: "X",
      column: "",
      icon: "❌",
      faClass: "fa fa-exclamation-triangle text-light",
    },
    {
      type: "Missed",
      item: "",
      column: "",
      icon: "",
      faClass: "fa fa-exclamation-triangle text-light",
    },
  ];

  function postToGoogle(update) {
    // $("#progress-loading").show();
    $("#progressTextgod").html(
      $("#selectTrackerTime option:selected").data("god")
    );

    $("#progress-modal").modal("show");
    __ApiCallStatus = true;

    $("#success-alert").hide();
    $("#errorMessage").html("");

    let paramMind = $(".radioMind:checked").val();
    let paramEnergy = $(".radioEnergy:checked").val();
    let paramWork = $(".radioWork:checked").val();
    let paramPastFix = $(".checkPastFix:checked").val();

    let selectedPeriod = $("#selectTrackerTime option:selected").val();

    let queryString = "?row=" + selectedPeriod;

    if (update) {
      queryString =
        queryString +
        "&mind=" +
        paramMind +
        "&energy=" +
        paramEnergy +
        "&work=" +
        paramWork;

      if (paramPastFix === "T") queryString = queryString + "&past=" + true;
    }

    console.log("Api QueryString Request:", queryString);

    let googleurl = _UpdaterApiUrl + queryString + "&callback=?";

    $.ajax({
      crossOrigin: true,
      url: googleurl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("Api Response Data:", data);

        try {
          if (data && data.chunks) {
            for (let i = 0; i < data.chunks.length; i++) {
              $("#lblChunkQuarter" + data.chunks[i].id).html(
                _Tracks.find((x) => x.row === data.chunks[i].row).quarter
              );
              $("#btnChunkPush" + data.chunks[i].id).attr(
                "data-row",
                data.chunks[i].row
              );

              // $("#lblChunkE" + data.chunks[i].id).html(data.chunks[i].e);
              // $("#lblChunkW" + data.chunks[i].id).html(data.chunks[i].w);
              // $("#lblChunkM" + data.chunks[i].id).html(data.chunks[i].m);
              $("#lblChunkM" + data.chunks[i].id).removeClass();
              $("#lblChunkW" + data.chunks[i].id).removeClass();
              $("#lblChunkE" + data.chunks[i].id).removeClass();
              $("#divChunk" + data.chunks[i].id).removeClass("bg-danger");

              if (data.chunks[i].m === "X" || data.chunks[i].m === "")
                $("#divChunk" + data.chunks[i].id).addClass("bg-danger");

              $("#lblChunkM" + data.chunks[i].id).addClass(
                getFaClass(data.chunks[i].m)
              );
              $("#lblChunkW" + data.chunks[i].id).addClass(
                getFaClass(data.chunks[i].w)
              );
              $("#lblChunkE" + data.chunks[i].id).addClass(
                getFaClass(data.chunks[i].e)
              );

              $("#lblChunkGod" + data.chunks[i].id).html(
                _Tracks.find((x) => x.row === data.chunks[i].row).god
              );
            }
            // showAlert("Deep Breath");
            //showAlert("<p>" + data + "</p>");
            // $("#errorMessage").html(data.lq);
            $("#hiddenLoggedRow").val(data.lr);
            $("#hiddenLastCallRow").val(data.chunks[0].row);

            $("#lblM5").html(data.count.mind.m5);
            $("#lblM4").html(data.count.mind.m4);
            $("#lblM3").html(data.count.mind.m3);
            $("#lblM2").html(data.count.mind.m2);
            $("#lblM1").html(data.count.mind.m1);

            $("#lblE3").html(data.count.energy.e3);
            $("#lblE2").html(data.count.energy.e2);
            $("#lblE1").html(data.count.energy.e1);

            $("#lblW5").html(data.count.work.w5);
            $("#lblW4").html(data.count.work.w4);
            $("#lblW3").html(data.count.work.w3);
            $("#lblW2").html(data.count.work.w2);
            $("#lblW1").html(data.count.work.w1);

            if (update && $(".checkEdit:checked").val() == "T") {
              if (data.lr === getCurrentTrackerTimeRow()) {
                $("#checkEdit").prop("checked", false);
                $("#radioMindA").click();
              }
            }
          } else {
            $("#errorMessage").html(" Data Not Returned by Api. ");
          }
        } catch (err) {
          console.log("Unhandled Error getFpostToGoogleaClass", err);
          $("#errorMessage").html("Unhandled Error postToGoogle: " + err);
        }

        // reloadStatusSheet();

        // $("#progress-loading").hide();
        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;
      },
      error: function (xhr, error_text, statusText) {
        $("#errorMessage").html(error_text);
        console.log("error_text", error_text);
        //$("#progress-loading").hide();
        $("#progress-modal").modal("hide");
      },
    });
  }

  populateTracker();
  populateSelectTrackerTime();

  function populateTracker() {
    g = 0;

    for (let h = 0; h < 24; ++h) {
      for (let q = 1; q <= 4; ++q) {
        _Tracks.push({
          row: getTrackerRow(h, q),
          quarter: (h % 12 || 12).toString().padStart(2, "0") + "-" + q + "",
          god: _gods[g],
        });

        if (g === 11) g = 0;
        else g++;
      }
    }

    // console.log(_Tracks);
  }

  function getTrackerRow(h, q) {
    return h * 4 + q + 3;
  }

  function populateSelectTrackerTime() {
    for (let i = 0; i < _Tracks.length; i++) {
      $("#selectTrackerTime").append(
        $("<option class='text-primary bg-white'></option>")
          .attr("value", _Tracks[i].row)
          .text(_Tracks[i].quarter)
          .attr("data-row", _Tracks[i].row)
          .attr("data-god", _Tracks[i].god)
      );
    }

    setTrackerTime();
  }

  function eyeOpenClose() {
    $("#apramadCtrl").html("&#xf0eb");

    setTimeout(function () {
      $("#apramadCtrl").html("&#xf06e");
    }, 1000);
  }

  eyeOpenClose();
  setInterval(eyeOpenClose, 2000);

  function setTrackerTime() {
    $("#selectTrackerTime").val(getCurrentTrackerTimeRow());
  }

  function showCurrentSelection() {
    $("#centerCoreD").html(
      Number($("#hiddenCurentRow").val()) - Number($("#hiddenLoggedRow").val())
    );
    $("#lableSelectedGod").html(
      $("#selectTrackerTime option:selected").data("god")
    );

    $("#lableNextGod").html(
      _gods[
        ($.inArray($("#selectTrackerTime option:selected").data("god"), _gods) +
          1) %
          _gods.length
      ]
    );
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

    $("#bodyCD").css("background-size", elaspePercentQ + "%");

    /*
    if (Number($("#centerCoreD").html()) > 1) {
      $("#bodyCD").css(
        "background-image",
        "linear-gradient(#ff2e2d,white,white,white,#ff2e2d ,#ff2e2d )"
      );
      $("#bodyCD").css("background-size", "100%");
    } else if (Number($("#centerCoreD").html()) === 1) {
      $("#bodyCD").css(
        "background-image",
        "linear-gradient(#f4b400,white,white,white,white ,white,white,#f4b400 )"
      );
      $("#bodyCD").css("background-size", elaspePercentQ + "%");
    } else {
      $("#bodyCD").css(
        "background-image",
        "linear-gradient(#babec4,white,white,white,white ,white,white,#babec4 )"
      );
      $("#bodyCD").css("background-size", elaspePercentQ + "%");
    }
*/
  }

  function showCurrentTimeLeft(hours, min, sec) {
    //var timeNow =  (hrs === 0 ? "12" : pad(hrs, 2)) +   ":" +      pad(min, 2) + ":" + pad(sec, 2)  +            " "     +            (hours > 12 ? "PM" : "AM");

    var timeNow = pad(14 - (min % 15), 2) + ":" + pad(60 - sec, 2);
    //var timeNow = pad(min % 15, 2) + ":" + pad(sec, 2);

    $("#timeLeft").text(timeNow);
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

  // ******* TIME Functions *******

  function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }

    return str;
  }

  $(".radioWork").on("change", function (event) {
    Work_Change();
  });
  $(".radioEnergy").on("change", function (event) {
    Energy_Change();
  });
  $(".radioMind").on("change", function (event) {
    Mind_Change();
  });

  function getFaClass(value) {
    try {
      return _configs.find((x) => x.item === value).faClass;
    } catch (error) {
      console.log("Unhandled Error getFaClass", value, error);
      $("#errorMessage").html("Unhandled Error getFaClass: " + error);
    }
  }

  function Mind_Change() {
    $("#selectedMp").removeClass();

    let selfa = getFaClass($(".radioMind:checked").val());
    $("#selectedMp").addClass(selfa);
  }
  function Work_Change() {
    $("#selectedWp").removeClass();
    let selfa = getFaClass($(".radioWork:checked").val());

    $("#selectedWp").addClass(selfa);
  }
  function Energy_Change() {
    $("#selectedEp").removeClass();
    let selfa = getFaClass($(".radioEnergy:checked").val());

    $("#selectedEp").addClass(selfa);
  }

  page_Load();

  __AppEnabledStatus = setInterval(processBeHereNow, 1000);

  // Clock hands position
  __ClockdarshanStatus = setInterval(function () {
    function r(el, deg) {
      el.setAttribute("transform", "rotate(" + deg + " 50 50)");
    }
    var d = new Date();
    let hours = d.getHours();
    let hourDeg = 30 * (hours % 12) + d.getMinutes() / 2;
    let minDeg = 6 * d.getMinutes();

    r(hourHand, hourDeg);
    r(minHand, 6 * d.getMinutes());
    let deg = getOnePointerDegree(hourDeg, minDeg);
    r(onepointerBase, deg);

    if ($(".checkEdit:checked").val() != "T") {
      r(onepointerCircle, deg);
      //console.log(hourDeg,minDeg);
    } else {
      let selectedPeriod = parseInt(
        $("#selectTrackerTime option:selected").val()
      );
      let hour2 = Math.floor((selectedPeriod - 4) / 4) % 12 || 12;
      let quarter2 = (selectedPeriod - 4) % 4;
      let hourDeg2 = 30 * (hour2 % 12);
      let minDeg2 = quarter2 * 90;

      let deg2 = getOnePointerDegree(hourDeg2, minDeg2);
      r(onepointerCircle, deg2);
    }

    //
  }, 1000);

  function getOnePointerDegree(hourDeg, minDeg) {
    let hdeg = 15;
    let hrem = hourDeg % 90;

    let mrem = minDeg % 90;

    if (hrem >= 30) hdeg = 45;
    if (hrem >= 60) hdeg = 75;

    return minDeg - mrem + hdeg;
  }

  function page_Load() {
    $("#selectTrackerTime").focus();
    $("#success-alert").hide();
    $("#radioWorkW2").click();
    $("#radioEnergyE2").click();
    $("#radioMindM3").click();

    $("#btnPlayVideo").on("click", playVideo);
    $("#btnResetSheet").on("click", oneClickResetSheet);
    $("#btnPopup").on("click", btnPopupClick);

    $("#clock-container").on("click", oneClickTracker);
    $("#ClockInnerCircle").on("click", oneClickTracker);
    $("#centerCoreD").on("click", oneClickTracker);

    $("#btnChunkPush4").on("click", function (event) {
      setTracketSelect($("#" + this.id).data("row"));
    });
    $("#btnChunkPush3").on("click", function (event) {
      setTracketSelect($("#" + this.id).data("row"));
    });
    $("#btnChunkPush2").on("click", function (event) {
      setTracketSelect($("#" + this.id).data("row"));
    });
    $("#btnChunkPush1").on("click", function (event) {
      setTracketSelect($("#" + this.id).data("row"));
    });

    postToGoogle(false);
  }

  function oneClickTracker() {
    postToGoogle(true);
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
      showCurrentSelection();

      showTimeElaspeProgress(min, sec);

      $("#hiddenCurentRow").val(getCurrentTrackerTimeRow());

      if ($(".checkEdit:checked").val() != "T") {
        setTrackerTime();

        if (
          Number($("#hiddenLoggedRow").val()) <
          Number($("#selectTrackerTime option:selected").val())
        ) {
          $("body").addClass("bag");
        } else {
          $("body").removeClass("bag");
        }
      } else {
        $("body").removeClass("bag");
      }

      if (min % 15 === 0 && sec === 1) {
        console.log("15 mins Quarter Shift Called");
        postToGoogle(false);
      }

      if (
        !__ApiCallStatus &&
        Number($("#hiddenCurentRow").val()) > 30 &&
        Number($("#hiddenCurentRow").val()) !==
          Number($("#hiddenLastCallRow").val())
      ) {
        postToGoogle(false);
        console.log("1 mins data Lag Api Called");
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  //-----------------------Old Code---------------------------------------

  function setTracketSelect(id) {
    //console.log("Selected", $("#hiddenTime"+id).val());

    $("#selectTrackerTime").val(id);

    if (Number($("#hiddenCurentRow").val()) === id) {
      $("#radioMindM3").click();
      $("#checkEdit").prop("checked", false);
    } else {
      $("#radioMindM2").click();
      $("#checkEdit").prop("checked", true);
    }
  }

  //

  function oneClickResetSheet() {
    if (confirm("Are you sure want to reset?")) {
      resetSheet();
    }
    return false;
  }

  function resetSheet() {
    $("#progress-modal").modal("show");
    __ApiCallStatus = true;

    $.ajax({
      crossOrigin: true,
      url: _ResetApiUrl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("oneClickResetSheet response data", data);
        //alert('SUCCESS - ' + data)
        $("#errorMessage").html(data);

        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;

        postToGoogle(true);
      },
      error: function (xhr, error_text, statusText) {
        //alert('Sheet Reset Done with - ' + error_text)
        console.log("error_text", error_text);
        $("#errorMessage").html("Reset action Error: " + error_text);

        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;
      },
    });
  }

  //

  // End of Code
});
