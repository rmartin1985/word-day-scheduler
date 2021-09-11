var today = document.querySelector("#currentDay");

class TimeblockObj {
    constructor(hour, todo) {
      this.hour = hour;
      this.todo = todo;
    }
  }
  
  var setCalendar = function() {
    var currentTimeblocks = getCurrentTimeblocks();
    var currentTime = moment();
  
    displayCurrentDate(currentTime);
    displayTimeblockRows(currentTime);
  
    $('.container').on('click', function(event) {
        containerClicked(event, currentTimeblocks);
      });
    setTimeblockText(currentTimeblocks);
  };
  
  function getCurrentTimeblocks() {
    var currentTimeblocks = localStorage.getItem('timeblockObjects');
    return currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
  }
  
  function displayCurrentDate(currentTime) {
    today.textContent = currentTime.format('dddd, MMMM Do YYYY');
  }
  
  //functions for displaying all timeblock rows 
  function displayTimeblockRows(currentTime) {
    var currentHour = currentTime.hour();
    //working hours are 9-5 or 9-17
    for (let i = 9; i <= 17; i ++) {
      var timeblock = createTimeblockRow(i);
      var hourCol = createCol(createHourDiv(i), 1);
      var textArea = createCol(createTextArea(i, currentHour), 10);
      var saveBtn = createCol(createSaveBtn(i), 1);
      appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
      $('.container').append(timeblock);
    }
  }
  
  function createTimeblockRow(hourId) {
    var timeblock = $(".container").append(`<div class='row' id='timeblock-${hourId}'></div>`)
    return timeblock;
  }
  
  function createCol(element) {
    var col = $(".row").append(`<div class= 'col-${colSize} p-0'></div>`);
    col.append(element);
    return col;
  }
  
  function createHourDiv(hour) {
    var hourCol = $(".col-1 p-0").append(`<div class='hour'>${formatHour(hour)}</div>`);
    return hourCol;
  }
  
  function formatHour(hour) {
    var hourString = String(hour);
    return moment(hourString, 'h').format('hA');
  }
  
  function createTextArea(hour, currentHour) {
    var textArea = $(".col-10 p-0").append(`<textarea class='${getTextAreaBackgroundClass(hour, currentHour)}></textarea>`);
    return textArea;
  }
  
  function getTextAreaBackgroundClass(hour, currentHour) {
    return hour < currentHour ? 'past' 
      : hour === currentHour ? 'present' 
      : 'future';
  }
  
  function createSaveBtn(hour) {
    var saveBtn = $(".col-1 p-0").append(`<button class='saveBtn' data-hour=${hour}><i class='fas fa-save'></i></button>`);
    return saveBtn;
  }
  
  function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
    var innerCols = [hourCol, textAreaCol, saveBtnCol];
    for (let col of innerCols) {
      timeblockRow.append(col);
    }
  }
  
  /*** functions for saving to local storage ***/
  function containerClicked(event, timeblockList) {
    if (isSaveButton(event)) {
      var timeblockHour = getTimeblockHour(event);
      var textAreaValue = getTextAreaValue(timeblockHour);
      placeTimeblockInList(new TimeblockObj(timeblockHour, textAreaValue), timeblockList);
      saveTimeblockList(timeblockList);
    }
  }
  
  function isSaveButton(event) {
    return event.target.matches('button') || event.target.matches('.fa-save');
  }
  
  function getTimeblockHour(event) {
    return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
  }
  
  function getTextAreaValue(timeblockHour) {
    return document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
  }
  
  function placeTimeblockInList(newTimeblockObj, timeblockList) {
    if (timeblockList.length > 0) {
      for (let savedTimeblock of timeblockList) {
        if (savedTimeblock.hour === newTimeblockObj.hour) {
          savedTimeblock.todo = newTimeblockObj.todo;
          return;
        }
      }
    } 
    timeblockList.push(newTimeblockObj);
    return;
  }
  
  function saveTimeblockList(timeblockList) {
    localStorage.setItem('timeblockObjects', JSON.stringify(timeblockList));
  }
  
  function setTimeblockText(timeblockList) {
    if (timeblockList.length === 0 ) {
      return;
    } else {
      for (let timeblock of timeblockList) {
        document.querySelector(`#timeblock-${timeblock.hour} textarea`)
          .value = timeblock.todo;
      }
    }
  }

  setCalendar();