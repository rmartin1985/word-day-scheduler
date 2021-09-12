// this holds the info that will be put in loocal storage
class timeBlockObj {
  constructor(hour, task) {
    this.hour = hour;
    this.task = task;
  }
}

// main function to display the calender on screen
var setCalendar = function () {
  var currentTimeBlocks = getCurrentTimeBlocks();
  var currentTime = moment();

  displayCurrentDate(currentTime);
  displayRows(currentTime);

  $('.container').on('click', function (event) {
    containerClicked(event, currentTimeBlocks);
  });
  setText(currentTimeBlocks);
};

// check local storage and display saved info if something is there
var getCurrentTimeBlocks = function() {
  var currentTimeBlocks = localStorage.getItem('timeBlockObjects');
  return currentTimeBlocks ? JSON.parse(currentTimeBlocks) : [];
}

// show the current day on the top of the screen
var displayCurrentDate = function(currentTime) {
  document.getElementById('currentDay')
    .textContent = currentTime.format('dddd, MMMM Do YYYY');
}

// main function to gather all the data and add to the TimeBlocks 
var displayRows = function(currentTime) {
  var currentHour = currentTime.hour();
  // had to convert time to 24 hour clock for PM times 
  for (let i = 9; i <= 17; i++) {
    var timeBlock = createTimeBlockRow(i);
    var hourCol = createCol(createHourDiv(i), 1);
    var textArea = createCol(createTextArea(i, currentHour), 10);
    var saveBtn = createCol(createSaveBtn(i), 1);
    appendTimeBlockColumns(timeBlock, hourCol, textArea, saveBtn);
    $('.container').append(timeBlock);
  }
}

// functions for DOM manipulation to run through the main function 
var createTimeBlockRow = function(hourId) {
  var timeBlock = $('<div>').addClass("row").attr("id", `timeBlock-${hourId}`);
  return timeBlock;
}

var createCol = function(element, colSize) {
  var col = $('<div>').addClass(`col-${colSize} p-0`)
  col.append(element);
  return col;
}

var createHourDiv = function(hour) {
  var hourCol = $('<div>').addClass("hour").text(hourFormat(hour));
  return hourCol;
}

var hourFormat = function(hour) {
  var hourString = String(hour);
  return moment(hourString, 'h').format('hA');
}

var createTextArea = function(hour, currentHour) {
  var textArea = $("<textarea>").addClass(statusColor(hour, currentHour));
  return textArea;
}

var statusColor = function(hour, currentHour) {
  return hour < currentHour ? 'past'
    : hour === currentHour ? 'present'
      : 'future';
}

var createSaveBtn = function(hour) {
  var saveBtn = $('<button>').addClass("saveBtn").attr('data-hour', hour).html('<i class="fas fa-save fa-2x"></i>');
  return saveBtn;
}

// puts everything together

var appendTimeBlockColumns = function(timeBlockRow, hourCol, textAreaCol, saveBtnCol) {
  var innerCols = [hourCol, textAreaCol, saveBtnCol];
  for (let col of innerCols) {
    timeBlockRow.append(col);
  }
}

/*** functions for saving to local storage ***/
var containerClicked = function(event, timeBlockList) {
  if (isSaveButton(event)) {
    var timeBlockHour = getTimeBlockHour(event);
    var textAreaValue = getTextAreaValue(timeBlockHour);
    placeTimeBlockInList(new timeBlockObj(timeBlockHour, textAreaValue), timeBlockList);
    saveTimeBlockList(timeBlockList);
  }
}

var isSaveButton = function(event) {
  return event.target.matches('button') || event.target.matches('.fa-save');
}

var getTimeBlockHour = function(event) {
  return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
}

var getTextAreaValue = function(timeBlockHour) {
  return document.querySelector(`#timeBlock-${timeBlockHour} textarea`).value;
}

var placeTimeBlockInList = function(newTimeBlockObj, timeBlockList) {
  if (timeBlockList.length > 0) {
    for (let savedTimeBlock of timeBlockList) {
      if (savedTimeBlock.hour === newTimeBlockObj.hour) {
        savedTimeBlock.task = newTimeBlockObj.task;
        return;
      }
    }
  }
  timeBlockList.push(newTimeBlockObj);
  return;
}

var saveTimeBlocks = function(timeBlockList) {
  localStorage.setItem('timeBlockObjects', JSON.stringify(timeBlockList));
}

var setText = function(timeBlockList) {
  if (timeBlockList.length === 0) {
    return;
  } else {
    for (let timeBlock of timeBlockList) {
      document.querySelector(`#timeBlock-${timeBlock.hour} textarea`)
        .value = timeBlock.task;
    }
  }
}

setCalendar();