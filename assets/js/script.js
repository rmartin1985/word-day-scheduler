// global variables up top 

// need a variable for the current day in moment
var currentDay = moment().format("dddd, MMMM Do");
// need a variable for the current hour in moment
var currentHour = moment().format("H A");
// need an array to store the hours and task objects
var workDay = [
    { hour: "8:00 AM", task: ""},
    { hour: "9:00 AM", task: ""},
    { hour: "10:00 AM", task: ""},
    { hour: "11:00 AM", task: ""},
    { hour: "12:00 PM", task: ""},
    { hour: "1:00 PM", task: ""},
    { hour: "2:00 PM", task: ""},
    { hour: "3:00 PM", task: ""},
    { hour: "4:00 PM", task: ""},
    { hour: "5:00 PM", task: ""},
    { hour: "6:00 PM", task: ""},
];

// need to add data to local storage 

// function to change color for the date conainers based on the time

// event to save the task created

// I think that's it for now? 