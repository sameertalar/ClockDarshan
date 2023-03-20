$(document).ready(function () {
  var __AppEnabledStatus = false;
  var __ClockdarshanStatus = false;
  var __ApiCallStatus = false;

  const _UpdaterApiUrl =
    "https://script.google.com/macros/s/AKfycbx76d72NhLVCnZdIlDioIeqclF5430ZuSUNc9648mY/dev";
  const _ResetApiUrl = "https://todo";

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
      faClass: "fa fa-exclamation-triangle text-danger",
    },
  ];

  const __Configuration = {
    mind: [
      {
        title: "Peace",
        column: "N",
        icon: "🕊️",
        fa: "fa fa-paper-plane text-success",
      },
      {
        title: "ध्यान",
        column: "O",
        icon: "🧘",
        fa: "fa fa-user-circle  text-primary",
      },
      {
        title: "अप्रमाद",
        column: "P",
        icon: "🧿",
        fa: "fa fa-eye  text-warning",
      },
      {
        title: "Pramad",
        column: "Q",
        icon: "🎳",
        fa: "fa fa-eye-slash tet-dark",
      },
      {
        title: "Buzzing",
        column: "R",
        icon: "🔥",
        fa: "fa fa-fire   text-danger",
      },
      {
        icon: "❌",
        fa: "fa fa-exclamation-triangle  text-danger",
        column: "❌",
      },
      { icon: "💤", fa: "fa fa-bed  text-secondary", column: "S" },
    ],
    energy: [
      { title: "High", column: "I", icon: "🔋", fa: "fa fa-star text-success" },
      {
        title: "Medium",
        column: "J",
        icon: "🥥",
        fa: "fa fa-star-half-o  text-warning",
      },
      {
        title: "Low",
        column: "K",
        icon: "⚪",
        fa: "fa fa fa-star-o text-danger",
      },
      {
        icon: "❌",
        fa: "fa fa-exclamation-triangle  text-danger",
        column: "❌",
      },
      { icon: "💤", fa: "fa fa-bed  text-secondary", column: "S" },
    ],
    work: [
      {
        title: "Spiritual",
        column: "C",
        icon: "🪔",
        fa: "fa fa-eercast text-info",
      },
      {
        title: "Value Add",
        column: "D",
        icon: "💎",
        fa: "fa fa-diamond  text-primary",
      },
      {
        title: "Health",
        column: "E",
        icon: "🌿",
        fa: "fa fa-envira  text-success",
      },
      {
        title: "Duty ",
        column: "F",
        icon: "👪",
        fa: "fa fa-life-ring  text-warning",
      },
      { title: "None", column: "G", icon: "🍂", fa: "fa fa-ban   text-danger" },
      {
        icon: "❌",
        fa: "fa fa-exclamation-triangle text-danger",
        column: "❌",
      },
      { icon: "💤", fa: "fa fa-bed  text-secondary", column: "S" },
    ],
  };

  function postToGoogle(update) {
    return;

    // $("#progress-loading").show();
    $("#progressTextgod").html(
      $("#selectTrackerTime option:selected").data("god")
    );

    $("#progress-modal").modal("show");
    __ApiCallStatus = true;

    $("#success-alert").hide();

    let apiurl =
      "https://script.google.com/macros/s/AKfycbz47icyo61ZY66s_Dt2PXTH0mT6QA3myJ73cw7CF-cH/dev";
    // Use Dev link no need to publish
    // "https://script.google.com/macros/s/AKfycbyOlFS1KprVp0UFfsfsjs8ibP-LbX4bnmDgKfy4s1qMUbaL6iLr/exec";

    let paramMind = $(".radioMind:checked").val(); // $("#selectMind option:selected").val();
    let paramEnergy = $(".radioEnergy:checked").val();
    let paramWork = $(".radioWork:checked").val();
    //let selectedPeriod = $("#selectTrackerTime option:selected")  .val()      .split("-");
    let selectedPeriod = $("#selectTrackerTime option:selected").val();

    let paramSleep = $(".checkSleep:checked").val();

    let queryString = "?row=" + selectedPeriod;

    if (update) {
      queryString =
        // "?hour=" +        selectedPeriod[0] +        "&quarter=" +        selectedPeriod[1]
        queryString +
        "&work=" +
        paramWork +
        "&energy=" +
        paramEnergy +
        "&mind=" +
        paramMind +
        "&sleep=" +
        paramSleep +
        "&callback=?";
    }

    console.log("Api QueryString Request:", queryString);

    let googleurl = apiurl + queryString;

    $.ajax({
      crossOrigin: true,
      url: googleurl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("Api Response Data:", data);

        for (let i = 0; i < data.chunks.length; i++) {
          $("#lblChunkQuarter" + data.chunks[i].id).html(
            data.chunks[i].h2 + "-" + data.chunks[i].q
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

          $("#lblChunkM" + data.chunks[i].id).addClass(
            getFaClass(data.chunks[i].m, "mind")
          );
          $("#lblChunkW" + data.chunks[i].id).addClass(
            getFaClass(data.chunks[i].w, "work")
          );
          $("#lblChunkE" + data.chunks[i].id).addClass(
            getFaClass(data.chunks[i].e, "energy")
          );

          $("#lblChunkGod" + data.chunks[i].id).html(data.chunks[i].g);
          $("#lblChunkTime" + data.chunks[i].id).html(data.chunks[i].t);

          $("#hiddenTime" + data.chunks[i].id).val(data.chunks[i].row);
        }
        // showAlert("Deep Breath");
        //showAlert("<p>" + data + "</p>");
        // $("#errorMessage").html(data.lq);
        $("#hiddenLoggedRow").val(data.lr);
        $("#hiddenLastCallRow").val(data.chunks[0].row);

        $("#lblMC").html(data.count.mind.c);
        $("#lblMM").html(data.count.mind.m);
        $("#lblMA").html(data.count.mind.a);
        $("#lblMP").html(data.count.mind.p);
        $("#lblMB").html(data.count.mind.b);

        $("#lblEH").html(data.count.energy.h);
        $("#lblEM").html(data.count.energy.m);
        $("#lblEL").html(data.count.energy.l);

        $("#lblWC").html(data.count.work.s);
        $("#lblWV").html(data.count.work.v);
        $("#lblWD").html(data.count.work.d);
        $("#lblWH").html(data.count.work.h);
        $("#lblWN").html(data.count.work.n);

        if (update && $(".checkEdit:checked").val() == "T") {
          if (data.lr === getCurrentTrackerTimeRow()) {
            $("#checkEdit").prop("checked", false);
            $("#radioMindA").click();
          }
        }

        // reloadStatusSheet();

        // $("#progress-loading").hide();
        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;
      },
      error: function (xhr, error_text, statusText) {
        showAlert(error_text + "<br> Error while Processing");
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

    //console.log(_Tracks);
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

  function Mind_Change() {
    $("#selectedM").removeClass();
    $("#selectedMp").removeClass();
    let selfa = _configs.find(
      (x) => x.item === $(".radioMind:checked").val()
    ).faClass;

    $("#selectedMp").addClass(selfa);
    $("#selectedM").addClass(selfa);
  }
  function Work_Change() {
    $("#selectedW").removeClass();
    $("#selectedWp").removeClass();
    let selfa = _configs.find(
      (x) => x.item === $(".radioWork:checked").val()
    ).faClass;

    $("#selectedWp").addClass(selfa);
    $("#selectedW").addClass(selfa);
  }
  function Energy_Change() {
    $("#selectedE").removeClass();
    $("#selectedEp").removeClass();
    let selfa = _configs.find(
      (x) => x.item === $(".radioEnergy:checked").val()
    ).faClass;

    $("#selectedEp").addClass(selfa);
    $("#selectedE").addClass(selfa);
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
        console.log("15 mins Quarter Switch Called");
        postToGoogle(false);
      }

      if (
        !__ApiCallStatus &&
        Number($("#hiddenCurentRow").val()) > 30 &&
        Number($("#hiddenCurentRow").val()) !==
          Number($("#hiddenLastCallRow").val())
      ) {
        postToGoogle(false);
        console.log("1 mins Lag  Switch Called");
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  //-----------------------Old Code---------------------------------------

  function getFaClass(column, type) {
    try {
      let config = __Configuration[type].find((x) => x.column === column);
      if (config) {
        //console.log("getFaClass", column, type, config.fa, config);
        return config.fa;
      } else return "text-danger";
    } catch (error) {
      console.log("getFaClass", column, type);
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  function setTracketSelect(id) {
    //console.log("Selected", $("#hiddenTime"+id).val());

    console.log(id);
    $("#selectTrackerTime").val(id);
    $("#checkEdit").prop("checked", true);

    if (Number($("#hiddenCurentRow").val()) === id) {
      $("#radioMindA").click();
    } else {
      $("#radioMindP").click();
    }
  }

  //

  function oneClickResetSheet() {
    $("#progress-modal").modal("show");
    __ApiCallStatus = true;

    $.ajax({
      crossOrigin: true,
      url: _ResetApiUrl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("oneClickResetSheet response data", data);
        //alert('SUCCESS - ' + data)
        showAlert("<h2> Done : " + data + "</h2>");
        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;

        postToGoogle(true);
      },
      error: function (xhr, error_text, statusText) {
        //alert('Sheet Reset Done with - ' + error_text)
        console.log("error_text", error_text);
        showAlert("<h2> Reset :" + error_text + "</h2>");
        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;
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
  //

  // End of Code
});
