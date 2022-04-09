// Constants

var inhaleSecs = 5;
var holdinSecs = 2;
var exhaleSecs = 9;
var holdoutSecs = 2;
var POINTS = 9; // the number of wave points
var LINE_WIDTH = 5; // wave's line width
var TWO_PI = Math.PI * 2; // used for circular arc
var FOCUS_RADIUS = 40; // set the diameter of our breathing focus circle
var FOCUS_LINE = 7; // set the diameter of our
var waveSecs = inhaleSecs + exhaleSecs + holdinSecs + holdoutSecs; // total seconds for the wave
var waveMsecs = waveSecs * 1000; // total milliseconds for the wave

// Global Variables
var theCanvas = document.getElementById("canvasOne");
var html5colorpicker = document.getElementById("html5colorpicker");

var FOCUS_LEFT;
var FOCUS_DIAM;

var pixelsPerMsec;
var hMin; // upper wave height
var hMax; // lower wave height

var startTime = new Date();
var noOfBreaths = 0;

// Page_Onload

setTimeout(displayTimeElasped, 1000);

if (!theCanvas || !theCanvas.getContext) {
  alert("No Canvas Support!");
}
var c = theCanvas.getContext("2d"); // canvas context

var phaseStart = Date.now(); // get our starting time
var h; // canvas height (global)
var w; // canvas width (global)
var middle; // canvas middle width
var x = new Array(POINTS); // array of horizontal positions
var y = new Array(POINTS); // array of vertical positions

setWaveParams();
currentInterval = setInterval("showCurrentWave()", 1000 / 30); // 30 FPS

//Functions

function setWaveParams() {
  //  console.log(document.getElementById("divWave").offsetWidth);

  //console.log("******* setWaveParams() Initialized *******");

  if (window.screen.width < 600) {
    c.canvas.width = window.screen.width - 40;
    c.canvas.height = window.screen.height;
  } else {
    c.canvas.width = 500;
    c.canvas.height = 800;
  }

  w = theCanvas.width; //|| document.body.clientWidth;// document.getElementById("divWave").offsetWidth-20;//     theCanvas.width; //= window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //h = theCanvas.height;
  h = theCanvas.height;

  document.getElementById("screenSize").innerHTML =
    "Screen:" +
    window.screen.width +
    "X" +
    window.screen.height +
    " Browser:" +
    window.innerWidth +
    "X" +
    window.innerHeight;

  //console.log('window.innerWidth');
  //console.log(window.innerWidth);
  //console.log('theCanvas.width+clockCanvas.width');
  //console.log(theCanvas.width+clockCanvas.width*2);

  //if (window.innerWidth < theCanvas.width + clockCanvas.width * 2) {
  //    document.getElementById('rightPanel').style.display = 'none';

  //} else {
  //    document.getElementById('rightPanel').style.display = 'block';
  //}

  middle = w / 2; // canvas half-width

  FOCUS_LEFT = middle - FOCUS_RADIUS - FOCUS_LINE / 2;
  FOCUS_DIAM = FOCUS_RADIUS * 2 + FOCUS_LINE;

  // size and position the various page items...

  theCanvas.height = Math.round(h / 2 + FOCUS_DIAM * 2);
  canvasTop = Math.round(h / 4 - FOCUS_DIAM);
  canvasBottom = canvasTop + theCanvas.height;
  theCanvas.style.top = canvasTop + "px";

  hMin = FOCUS_RADIUS + FOCUS_LINE; // Math.round(0.25 * h);			// upper wave height
  hMax = (FOCUS_RADIUS + FOCUS_LINE) * 2 + h / 2; // lower wave height

  pixelsPerMsec = w / waveMsecs; // time to pixels conversion factor

  var inhaleHorz = Math.round((inhaleSecs / waveSecs) * w);
  var holdinHorz = Math.round((holdinSecs / waveSecs) * w);
  var exhaleHorz = Math.round((exhaleSecs / waveSecs) * w);
  var holdoutHorz = Math.round((holdoutSecs / waveSecs) * w);

  //console.log('inhaleHorz=' + inhaleHorz + ';holdinHorz=' + holdinHorz + ';exhaleHorz=' + exhaleHorz + ';holdoutHorz=' + holdoutHorz);

  x[0] = 0;
  x[1] = x[0] + inhaleHorz;
  x[2] = x[1] + holdinHorz;
  x[3] = x[2] + exhaleHorz;
  x[4] = x[3] + holdoutHorz;
  x[5] = x[4] + inhaleHorz;
  x[6] = x[5] + holdinHorz;
  x[7] = x[6] + exhaleHorz;
  x[8] = x[7] + holdoutHorz;

  // console.log('x');
  // console.log(x);

  y[0] = y[3] = y[4] = y[7] = y[8] = hMax;
  y[1] = y[2] = y[5] = y[6] = hMin;

  //console.log('y');
  //console.log(y);
}

function showCurrentWave() {
  theCanvas.style.backgroundColor = html5colorpicker.value;
  c.fillStyle = html5colorpicker.value; // '#FFA64C';

  c.fillRect(0, hMin - LINE_WIDTH / 2, w, hMax - hMin + LINE_WIDTH); // remove any previous wave
  c.fillRect(
    FOCUS_LEFT,
    hMin - FOCUS_RADIUS - FOCUS_LINE / 2,
    FOCUS_DIAM,
    FOCUS_DIAM
  ); // remove the previous focus circle
  c.fillRect(
    FOCUS_LEFT,
    hMax - FOCUS_RADIUS - FOCUS_LINE / 2,
    FOCUS_DIAM,
    FOCUS_DIAM
  ); // remove the previous focus circle

  var phaseShift = Date.now() - phaseStart; // get our time shift
  if (phaseShift >= waveMsecs) {
    // have we wrapped out of our wave period?
    phaseStart += waveMsecs; // yes, so bump our reference up by the wave's period
    phaseShift -= waveMsecs; // and drop our shift back into range
  }
  var pixelShift = Math.round(pixelsPerMsec * phaseShift);

  c.strokeStyle = "#0F9D58"; /*Green */
  c.lineWidth = LINE_WIDTH;
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo((leftX = x[0] - pixelShift), y[0]);

  for (var j = 1; j < POINTS; j++) {
    c.lineTo((rightX = x[j] - pixelShift), y[j]);

    if (leftX <= middle && rightX >= middle) {
      focus =
        ((y[j] - y[j - 1]) * (middle - leftX)) / (rightX - leftX) + y[j - 1];
    }

    if (focus === y[0] && rightX === middle && leftX === 0) {
      // setTimeout("resetAudio()", holdoutSecs / 3 * 1000);
      // setTimeout("playAudio()", holdoutSecs * 1000);
      //  console.log('J=' + j + '; X=' + x[j] + '; Y=' + y[j] + ';focus=' + focus + ';middle=' + middle + ';leftX=' + leftX + ';rightX=' + rightX);

      noOfBreaths++;
      // console.log('Breath: ' + noOfBreaths);
      document.getElementById("noOfBreaths").innerText = noOfBreaths;
    }

    leftX = rightX;
  }

  c.stroke();

  c.beginPath();
  c.arc(middle, focus, FOCUS_RADIUS, 0, TWO_PI, false);
  c.fillStyle = "#DB4437"; /*Red */
  c.fill();

  /*
        var background = new Image();
        background.src = "red.png";
        
        background.onload = function(){
            var pattern = c.createPattern(this, "repeat");
        c.fillStyle = pattern;
        c.fill();  
        }
    */

  c.lineWidth = FOCUS_LINE;
  c.strokeStyle = "Yellow"; // '#F4B400'; /*Yellow */
  c.stroke();

  c.strokeStyle = "#0000ff"; /* Blue */
  c.lineWidth = FOCUS_LINE / 3;
  c.stroke();
}

//  Functions

function displayTimeElasped() {
  // later record end time
  var endTime = new Date();

  // time difference in ms
  var timeDiff = endTime - startTime;

  // strip the miliseconds
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff % 60);

  // remove seconds from the date
  timeDiff = Math.floor(timeDiff / 60);

  // get minutes
  var minutes = Math.round(timeDiff % 60);

  // remove minutes from the date
  timeDiff = Math.floor(timeDiff / 60);

  // get hours
  var hours = Math.round(timeDiff % 24);

  document.getElementById("timeElasped").innerText =
    hours + ":" + minutes + ":" + seconds;

  setTimeout(displayTimeElasped, 1000);
}

function GetTime(sec) {
  var d = new Date(); // for now

  if (sec) {
    return (
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds() +
      "." +
      d.getMilliseconds()
    );
  }

  return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); // + "." + d.getMilliseconds()
}
