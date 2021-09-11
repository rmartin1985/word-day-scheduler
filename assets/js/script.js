class TimeblockObj {
    constructor(hour, todo) {
      this.hour = hour;
      this.todo = todo;
    }
  }
  
  var setCalendar = function() {
    const currentTimeblocks = getCurrentTimeblocks();
    const currentTime = moment();
  
    displayCurrentDate(currentTime);
    displayTimeblockRows(currentTime);
  
    $('.container').on('click', function(event) {
        containerClicked(event, currentTimeblocks);
      });
    setTimeblockText(currentTimeblocks);
  };
  
  function getCurrentTimeblocks() {
    const currentTimeblocks = localStorage.getItem('timeblockObjects');
    return currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
  }
  
  function displayCurrentDate(currentTime) {
    document.getElementById('currentDay')
      .textContent = currentTime.format('dddd, MMMM Do YYYY');
  }
  
  // functions for displaying all timeblock rows
  function displayTimeblockRows(currentTime) {
    const currentHour = currentTime.hour();
    // convert working hours from 9 - 5 to 9 -17 
    for (let i = 9; i <= 17; i ++) {
      const timeblock = createTimeblockRow(i);
      const hourCol = createCol(createHourDiv(i), 1);
      const textArea = createCol(createTextArea(i, currentHour), 10);
      const saveBtn = createCol(createSaveBtn(i), 1);
      appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
      $('.container').append(timeblock);
    }
  }
  
  function createTimeblockRow(hourId) {
    const timeblock = $('<div>').addClass("row").attr("id", `timeblock-${hourId}`);
    return timeblock;
  }
  
  function createCol(element, colSize) {
    const col = $('<div>').addClass(`col-${colSize} p-0`)
    col.append(element);
    return col;
  }
  
  function createHourDiv(hour) {
    const hourCol = $('<div>').addClass("hour").text(formatHour(hour));
    return hourCol;
  }
  
  function formatHour(hour) {
    const hourString = String(hour);
    return moment(hourString, 'h').format('hA');
  }
  
  function createTextArea(hour, currentHour) {
    const textArea = $("<textarea>").addClass(getTextAreaBackgroundClass(hour, currentHour));
    return textArea;
  }
  
  function getTextAreaBackgroundClass(hour, currentHour) {
    return hour < currentHour ? 'past' 
      : hour === currentHour ? 'present' 
      : 'future';
  }
  
  function createSaveBtn(hour) {
    const saveBtn = $('<button>').addClass("saveBtn").attr('data-hour', hour).html('<i class="fas fa-save"></i>');
    return saveBtn;
  }
  
  function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
    const innerCols = [hourCol, textAreaCol, saveBtnCol];
    for (let col of innerCols) {
      timeblockRow.append(col);
    }
  }
  
  /*** functions for saving to local storage ***/
  function containerClicked(event, timeblockList) {
    if (isSaveButton(event)) {
      const timeblockHour = getTimeblockHour(event);
      const textAreaValue = getTextAreaValue(timeblockHour);
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