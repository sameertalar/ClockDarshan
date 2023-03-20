const sheetName = "Today";
const StatusColumn = "AY";
var clockDarshanReturnValue = "";
var RowNumber = 0;
const HourColumn = "AD";
const TotalTrackedColumn = "T";

const _ColumnStatusWork = "AU";
const _ColumnStatusEnergy = "AW";
const _ColumnStatusMind = "AY";

//https://script.google.com/macros/s/AKfycbzkc6paNM1k1C2z7q0xB9wf1WjJNKPUniitk6J5UGhOyGL8kgxq-CbHxSrWp7jwQTz4Ag/exec
//https://script.google.com/macros/s/AKfycbz47icyo61ZY66s_Dt2PXTH0mT6QA3myJ73cw7CF-cH/dev

function doGet(e) {
  let callback = e.parameter.callback;

  let paramRow = e.parameter.row;
  let paramHour = e.parameter.hour;
  let paramQuarter = e.parameter.quarter;
  let paramSleep = e.parameter.sleep;
  let paramMind = e.parameter.mind;
  let paramEnergy = e.parameter.energy;
  let paramWork = e.parameter.work;
  let paramVersion = e.parameter.version;
  let trend;

  try {
    if (paramMind) {
      processUpdates(paramRow, paramSleep, paramWork, paramEnergy, paramMind);
    }

    // Build Trend
    //trend = getPastTrend(paramRow);

    trend = getPastTrend();

    return ContentService.createTextOutput(
      callback + "(" + JSON.stringify(trend) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (err) {
    clockDarshanReturnValue = err.message;
  }

  //do stuff ...
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(clockDarshanReturnValue + " " + trend) + ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  Logger.log(JSON.stringify(e));

  var htmlOutput = HtmlService.createTemplateFromFile("Index");
  // htmlOutput.sakshi = e.parameter.txtSakshi;

  return htmlOutput.evaluate();
}

function getChunkData(trendData, i, rowCurrent) {
  let item = {
    id: i + 1,
    row: trendData[i][0],
    h: trendData[i][6],
    h2: trendData[i][1],
    q: trendData[i][2],
    m: "❌",
    w: "❌",
    e: "❌",
    g: trendData[i][8],
    t: trendData[i][4],
  };

  if (trendData[i][7]) {
    item.w = trendData[i][3];
    item.e = trendData[i][5];
    item.m = trendData[i][7];
  } else if (Number(trendData[i][0]) > rowCurrent) {
    item.w = "";
    item.e = "";
    item.m = "";
  }

  return item;
}

function processUpdates(
  rowNumber,
  paramSleep,
  paramWork,
  paramEnergy,
  paramMind
) {
  let s = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = s.getSheetByName(sheetName);

  // Update Sheet Values

  //  let rowNumber = (Number(paramHour) * 4) + 3 + Number(paramQuarter);

  sheet.getRange("C" + rowNumber + ":S" + rowNumber).uncheck();

  if (paramSleep && paramSleep != "undefined") {
    sheet.getRange(paramSleep + rowNumber).check();
  } else {
    if (paramMind) sheet.getRange(paramMind + rowNumber).check();

    if (paramEnergy) sheet.getRange(paramEnergy + rowNumber).check();

    if (paramWork) sheet.getRange(paramWork + rowNumber).check();
  }
}

function doGet_debug() {
  let e = {
    parameter: {},
  };
  // e.parameter.hour = "23";
  e.parameter.quarter = "2";
  e.parameter.sleep = "S";
  e.parameter.energy = "J";
  e.parameter.work = "D";

  doGet(e);
}

function getPastTrend_debug() {
  getPastTrend();
}

function getPastTrend(paramRow) {
  let s = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = s.getSheetByName(sheetName);

  if (!paramRow) {
    paramRow = getCurrentRowNumber();
  } else {
    paramRow = Number(paramRow);
  }

  let rowCurrent = paramRow;

  let trendData;
  let loggedQuarter = sheet.getRange("W1").getValue();
  let loggedRow = sheet.getRange("X1").getValue();
  let countData = sheet.getRange("C2:R2").getValues();

  let returnData = {
    lq: loggedQuarter,
    lr: loggedRow,
    chunks: [],
    count: {
      work: {
        s: formatStat(countData[0][0]),
        v: formatStat(countData[0][1]),
        h: formatStat(countData[0][2]),
        d: formatStat(countData[0][3]),
        n: formatStat(countData[0][4]),
      },
      energy: {
        h: formatStat(countData[0][6]),
        m: formatStat(countData[0][7]),
        l: formatStat(countData[0][8]),
      },
      mind: {
        c: formatStat(countData[0][11]),
        m: formatStat(countData[0][12]),
        a: formatStat(countData[0][13]),
        p: formatStat(countData[0][14]),
        b: formatStat(countData[0][15]),
      },
    },
  };

  if (rowCurrent > 7) {
    trendData = sheet
      .getRange("AR" + (rowCurrent - 3) + ":AZ" + rowCurrent)
      .getValues();
  } else {
    trendData = sheet.getRange("AR4:AZ7").getValues();
  }

  returnData.chunks.push(getChunkData(trendData, 3, rowCurrent));
  returnData.chunks.push(getChunkData(trendData, 2, rowCurrent));
  returnData.chunks.push(getChunkData(trendData, 1, rowCurrent));
  returnData.chunks.push(getChunkData(trendData, 0, rowCurrent));

  return returnData;
}

function formatStat(n) {
  if (Number(n) === 0) return "";
  else return n;
}

function getCurrentRowNumber() {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();

  let rowNumber = hour * 4 + 3;
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

  rowNumber = rowNumber + quarter;

  return rowNumber;
}
