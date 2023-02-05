$(document).ready(function () {
  var __AppEnabledStatus = false;
  var __ClockdarshanStatus = false;
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
    $("#radioWorkD").click();
    $("#radioEnergyM").click();
    $("#radioMindA").click();

    $("#btnPlayVideo").on("click", playVideo);
    $("#btnResetSheet").on("click", oneClickResetSheet);
    $("#btnPopup").on("click", btnPopupClick);
    $("#plusQuarter").on("click", plusQuarter);
    $("#minusQuarter").on("click", minusQuarter);

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

    populateSelectTrackerTime();

    postToGoogle(false);
  }

  function setTracketSelect(id) {
    //console.log("Selected", $("#hiddenTime"+id).val());
    $("#selectTrackerTime").val(id);
    $("#checkEdit").prop("checked", true);
    $("#radioMindP").click();
  }

  function btnTestClick() {
    postToGoogle(true);
  }

  function oneClickTracker() {
    postToGoogle(true);
  }

  function populateSelectTrackerTime() {
    let gods = [
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
    g = 0;

    for (let h = 0; h < 24; ++h) {
      for (let q = 1; q <= 4; ++q) {
        $("#selectTrackerTime").append(
          $("<option class='text-primary bg-white'></option>")
            .attr("value", getTrackerRow(h, q))
            .text((h % 12 || 12).toString().padStart(2, "0") + "-" + q + "")
            .attr("data-row", getTrackerRow(h, q))
            .attr("data-god", gods[g])
        );

        if (g === 11) g = 0;
        else g++;
      }
    }

    setTrackerTime();
  }

  //

  function getTrackerRow(h, q) {
    return h * 4 + q + 3;
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
        postToGoogle(false);
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

  function showCurrentSelection() {
    $("#centerCoreD").html(
      getCurrentTrackerTimeRow() - Number($("#hiddenLoggedRow").val())
    );
    $("#lableSelectedGod").html(
      $("#selectTrackerTime option:selected").data("god")
    );
  }

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

        postToGoogle(true);
      },
      error: function (xhr, error_text, statusText) {
        //alert('Sheet Reset Done with - ' + error_text)
        console.log("error_text", error_text);
        showAlert("<h2> Reset :" + error_text + "</h2>");
        $("#progress-loading").hide();
      },
    });
  }

  function postToGoogle(update) {
    $("#progress-loading").show();
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
        for (let i = 0; i < data.chunks.length; i++) {
          $("#lblChunkQuarter" + data.chunks[i].id).html(
            data.chunks[i].h2 + "-" + data.chunks[i].q
          );
          $("#btnChunkPush" + data.chunks[i].id).attr(
            "data-row",
            data.chunks[i].row
          );
          $("#lblChunkE" + data.chunks[i].id).html(data.chunks[i].e);
          $("#lblChunkW" + data.chunks[i].id).html(data.chunks[i].w);
          $("#lblChunkM" + data.chunks[i].id).html(data.chunks[i].m);
          $("#lblChunkGod" + data.chunks[i].id).html(data.chunks[i].g);
          $("#lblChunkTime" + data.chunks[i].id).html(data.chunks[i].t);

          $("#hiddenTime" + data.chunks[i].id).val(data.chunks[i].row);
        }
        // showAlert("Deep Breath");
        //showAlert("<p>" + data + "</p>");
        // $("#errorMessage").html(data.lq);
        $("#hiddenLoggedRow").val(data.lr);

        if (update && $(".checkEdit:checked").val() == "T") {
          if (data.lr === getCurrentTrackerTimeRow()) {
            $("#checkEdit").prop("checked", false);
            $("#radioMindA").click();
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

  function btnPopupClick() {
    var myWindow = window.open(
      window.location.href,
      "",
      "width=455,height=625"
    );
    $("#collapseControlsSettings").collapse("toggle");
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
    $("#centerCoreM").html(
      __Configuration["mind"].find(
        (x) => x.column === $(".radioMind:checked").val()
      ).icon
    );
  }
  function Work_Change() {
    $("#centerCoreW").html(
      __Configuration["work"].find(
        (x) => x.column === $(".radioWork:checked").val()
      ).icon
    );
  }
  function Energy_Change() {
    $("#centerCoreE").html(
      __Configuration["energy"].find(
        (x) => x.column === $(".radioEnergy:checked").val()
      ).icon
    );
  }

  function plusQuarter() {
    updownArrow(false);

    if ($(".checkEdit:checked").val() == "T") {
      if (Number($("#hiddenLoggedRow").val()) === getCurrentTrackerTimeRow()) {
        $("#checkEdit").prop("checked", false);
        $("#radioMindA").click();
      }
    }
  }

  function minusQuarter() {
    updownArrow(true);
    $("#radioMindP").click();
  }

  function updownArrow(down) {
    $("#checkEdit").prop("checked", true);
    let selectedPeriod = parseInt(
      $("#selectTrackerTime option:selected").val()
    );

    if (down) {
      newVal = selectedPeriod - 1;
    } else {
      newVal = selectedPeriod + 1;
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
  //

  function setTrackerTime() {
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

  function showTimeElaspeProgress(min, sec) {
    let elaspePercentQ = ((min % 15) * 60 + sec) / 9;
    $("#quarterStatus").width(elaspePercentQ + "%");
    $("#bodyCD").css("background-size", elaspePercentQ + "%");

    if (Number($("#centerCoreD").html()) > 0) {
      $("#bodyCD").css(
        "background-image",
        "linear-gradient(white,white,#ffa3a6 ,white,white )"
      );
    } else {
      $("#bodyCD").css(
        "background-image",
        "linear-gradient(white,white,#ccffe6 ,white,white )"
      );
    }
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

  // End of Code
});
