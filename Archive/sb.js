const sheetName = "Today";
var clockDarshanReturnValue = "Got Request";
var RowNumber = 0;

var configuration = {
  mind: [
    { title: "Peace", code: "C", column: "C" },
    { title: "ध्यान", code: "M", column: "D" },
    { title: "अप्रमाद", code: "A", column: "E" },
    { title: "Focus", code: "F", column: "F" },
    { title: "Buzzing", code: "B", column: "G" },
  ],
  energy: [
    { title: "High", code: "H", column: "I" },
    { title: "Medium", code: "M", column: "J" },
    { title: "Low", code: "L", column: "K" },
  ],
  work: [
    { title: "Creativity", code: "C", column: "N" },
    { title: "Office", code: "W", column: "O" },
    { title: "Routine", code: "R", column: "P" },
    { title: "Family", code: "F", column: "Q" },
    { title: "Social", code: "S", column: "R" },
    { title: "None", code: "N", column: "S" },
  ],
};

function doGet(e) {
  let callback = e.parameter.callback;
  let paramHour = e.parameter.hour;

  let paramQuarter = e.parameter.quarter;
  let paramMind = e.parameter.mind;
  let paramEnergy = e.parameter.energy;
  let paramWork = e.parameter.work;
  let paramText = e.parameter.text;
  let paramMinute = e.parameter.minute;
  let mindTrend = "";

  try {
    let s = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = s.getSheetByName(sheetName);

    // let queryString =      "?hour=" +      paramHour +      "&quarter=" +      paramQuarter +      "&mind=" +      paramMind +      "&energy=" +      paramEnergy +      "&work=" +      paramWork +      "&paramText=" +      paramText;
    //  sheet.getRange("AF8").setValue(queryString);

    if (paramHour && paramQuarter) {
      Process(
        sheet,
        paramHour,
        paramQuarter,
        paramMind,
        paramEnergy,
        paramWork
      );
    }

    if (RowNumber > 0) {
      let rowTill = RowNumber - 3;

      if (RowNumber < 7) {
        rowTill = 4;
      }

      for (let i = rowTill; i <= RowNumber; i++) {
        mindTrend += sheet.getRange("AV" + i).getValue();
      }
    }
  } catch (err) {
    clockDarshanReturnValue = err.message;
  }

  //do stuff ...
  return ContentService.createTextOutput(
    callback +
      "(" +
      JSON.stringify(clockDarshanReturnValue + " " + mindTrend) +
      ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function Process(
  sheet,
  paramHour,
  paramQuarter,
  paramMind,
  paramEnergy,
  paramWork
) {
  paramHour = parseInt(paramHour);

  for (let i = 4; i < 74; i++) {
    if (paramHour === parseInt(sheet.getRange("L" + i).getValue())) {
      RowNumber = i + parseInt(paramQuarter) - 1;

      if (paramMind) {
        sheet.getRange("C" + RowNumber + ":G" + RowNumber).uncheck();
        UpdateColumn(sheet, RowNumber, "mind", paramMind);
      }
      if (paramEnergy) {
        sheet.getRange("I" + RowNumber + ":K" + RowNumber).uncheck();
        UpdateColumn(sheet, RowNumber, "energy", paramEnergy);
      }
      if (paramWork) {
        sheet.getRange("N" + RowNumber + ":S" + RowNumber).uncheck();
        UpdateColumn(sheet, RowNumber, "work", paramWork);
      }

      clockDarshanReturnValue = "Success for all";
      break;
    }
  }
}

function UpdateColumn(sheet, RowNumber, prop, code) {
  var column = getColumn(prop, code);

  if (column) {
    sheet.getRange(column + RowNumber).check();
  }
}

function getColumn(prop, code) {
  let column = "";

  try {
    column = configuration[prop].find((x) => x.code === code).column;
  } catch (err) {
    column = "";
  }

  return column;
}

function doPost(e) {
  let returnValue = "Not Implemented";
  let callback = e.parameter.callback;
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(returnValue) + ")"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
