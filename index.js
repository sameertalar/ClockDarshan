$(document).ready(function () {
  var __ApiCallStatus = false;

  const _UpdaterApiUrl =
    "https://script.google.com/macros/s/AKfycbyI_7nngMEAJIF0K-i7XAi9u1wyjHupw0uNK9uk7qec/dev";
  const _ResetApiUrl =
    "https://script.google.com/macros/s/AKfycbw8xlLx02pJJWyaJIFMNdsT_h-C04drUlpFZeCVb4v1/dev";

  function createChunkDiv(data, currentRow) {
    let divRow = document.createElement("div");
    if (data.row) divRow.id = "row" + data.row;
    divRow.className = "row ";

    if (currentRow === data.row)
      divRow.className = divRow.className + " bg-highlight";
    else if (currentRow === data.row - 1)
      divRow.className = divRow.className + " bg-highlight2";

    //------- col 1
    let divC2 = document.createElement("div");
    divC2.className = "col-4 px-0  text-end";

    let radio1 = document.createElement("input");
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("name", "radioChunk");
    radio1.setAttribute("value", data.row);
    radio1.setAttribute("id", "radioChunk" + data.row);
    radio1.setAttribute("class", "btn-check radioChunk");
    radio1.setAttribute("autocomplete", "off");

    if (currentRow === data.row) radio1.checked = true;

    if (currentRow < data.row) radio1.disabled = true;

    divC2.appendChild(radio1);

    let lbl1 = document.createElement("label");
    lbl1.innerHTML = data.chunk;
    lbl1.setAttribute("for", "radioChunk" + data.row);

    if (currentRow === data.row)
      lbl1.setAttribute("class", "btn  btn-outline-primary ");
    else if (currentRow > data.row)
      lbl1.setAttribute("class", "btn  btn-outline-dark py-0");
    else lbl1.setAttribute("class", "btn  btn-outline-secondary py-0");

    divC2.appendChild(lbl1);

    divRow.appendChild(divC2);

    //------- col 2
    let divC1 = document.createElement("div");
    divC1.className = "col-2 px-0 ms-2  text-center";

    let i1 = document.createElement("i");

    if (currentRow >= data.row && data.value === "")
      i1.className = " fa fa-exclamation-triangle text-danger ";
    else i1.className = getFaClass(data.value);

    if (currentRow == data.row) i1.className = i1.className + " fa-2x ";
    else i1.className = i1.className + " cdicon2 ";

    i1.setAttribute("aria-hidden", "true");
    divC1.appendChild(i1);

    divRow.appendChild(divC1);

    //------- Col 3

    let divC3 = document.createElement("div");
    divC3.className = "col-5  text-start ms-2  ";

    divC3.innerText = data.god;

    if (currentRow === data.row)
      divC3.className = divC3.className + " bg-primary text-white py-1   ";
    else if (currentRow === data.row - 1)
      divC3.className = divC3.className + "   text-warning ";
    else if (currentRow > data.row)
      divC3.className = divC3.className + " text-dark ";
    else divC3.className = divC3.className + " text-secondary ";

    divRow.appendChild(divC3);

    return divRow;
  }

  function postToGoogle(update) {
    $("#progress-modal").modal("show");
    __ApiCallStatus = true;

    $("#success-alert").hide();
    $("#errorMessage").html("");

    let paramMind = "";

    if (update) {
      paramMind = $(".radioMind:checked").val();
    }

    let googleurl =
      _UpdaterApiUrl +
      "?row=" +
      $(".radioChunk:checked").val() +
      "&mind=" +
      paramMind;
    console.log("Api QueryString Request:", googleurl);

    $.ajax({
      crossOrigin: true,
      url: googleurl,

      dataType: "jsonp",
      success: function (data, textStatus, xhr) {
        console.log("Api Response Data:", data);

        try {
          if (data && data.chunks) {
            $("#hiddenLoggedRow").val(data.loggedRow);
            $("#hiddenLastCallRow").val(data.currentRow);

            $("#lblM5").html(data.counts.calm);
            $("#lblM4").html(data.counts.med);
            $("#lblM3").html(data.counts.apramad);
            $("#lblM2").html(data.counts.pramad);
            $("#lblM1").html(data.counts.buzz);

            $("#containerPath").html("");

            for (let i = data.chunks.length - 1; i >= 0; i--) {
              var divRow = createChunkDiv(data.chunks[i], data.currentRow);
              document.getElementById("containerPath").appendChild(divRow);

              console.log(
                data.chunks[i].chunk +
                  " - " +
                  data.chunks[i].value +
                  " - " +
                  data.chunks[i].row +
                  " - " +
                  data.chunks[i].god
              );
            }
          }
        } catch (err) {
          console.log(
            "Unhandled Error while processing postToGoogle response",
            err
          );
          $("#containerPath").html(err);
          $("#errorMessage").html("Unhandled Error postToGoogle: " + err);
        }

        $("#progress-modal").modal("hide");
        __ApiCallStatus = false;
      },
      error: function (xhr, error_text, statusText) {
        $("#errorMessage").html(error_text);
        console.log("error_text", error_text);
        $("#containerPath").html(error_text);
        $("#progress-modal").modal("hide");
      },
    });
  }

  function getTrackerRow(h, q) {
    return h * 4 + q + 3;
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

  function showCurrentSelection() {
    $("#centerCoreD").html(
      Number($("#hiddenCurentRow").val()) - Number($("#hiddenLoggedRow").val())
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

  function btnExcelOpenClick() {
    window.open(
      "https://docs.google.com/spreadsheets/d/1nOrZM3sExoxmFgyzhiwi6BrPvQT-9Omlt2x5kno8H5w/edit#gid=1698318143",
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
      if (value && value !== "undefined")
        return _configs.find((x) => x.column === value).faClass;
      else return "";
    } catch (error) {
      console.log("Unhandled Error getFaClass", value, error);
      $("#errorMessage").html("Unhandled Error getFaClass: " + error);
    }
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

    r(onepointerCircle, deg);

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
    $("#success-alert").hide();
    $("#radio-mind-3").click();

    $("#btnPlayVideo").on("click", playVideo);
    $("#btnResetSheet").on("click", oneClickResetSheet);
    $("#btnPopup").on("click", btnPopupClick);
    $("#btnExcel").on("click", btnExcelOpenClick);

    $("#clock-container").on("click", oneClickTracker);
    $("#ClockInnerCircle").on("click", oneClickTracker);
    $("#centerCoreD").on("click", oneClickTracker);

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

      if (Number($("#hiddenLoggedRow").val()) < getCurrentTrackerTimeRow()) {
        $("body").addClass("bag");
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
        // console.log("1 mins data Lag Api Called");
      }
    } catch (error) {
      console.log("Unhandled Error", error);
      $("#errorMessage").html("Unhandled Error: " + error);
    }
  }

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

  const _configs = [
    {
      type: "Mind",
      item: "M5",
      column: "D",
      icon: "🕊️",
      faClass: "fa fa-eercast text-primary",
    },
    {
      type: "Mind",
      item: "M4",
      column: "E",
      icon: "🧘",
      faClass: "fa fa-user-circle text-warning",
    },
    {
      type: "Mind",
      item: "M3",
      column: "F",
      icon: "👁️",
      faClass: "fa fa-eye text-success",
    },
    {
      type: "Mind",
      item: "M2",
      column: "G",
      icon: "🎳",
      faClass: "fa fa-eye-slash text-dark", // fa-low-vision
    },
    {
      type: "Mind",
      item: "M1",
      column: "H",
      icon: "🔥",
      faClass: "fa fa-fire text-danger",
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
  //

  // End of Code
});
