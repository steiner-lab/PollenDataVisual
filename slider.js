var slider = document.getElementById("myRange");
var out_mon = document.getElementById("mon");
var out_year = document.getElementById("year");

// find the start date and end date inputted, convert these to arrays
// data-start and data-end
var start = slider.dataset.start;
var end = slider.dataset.end;
// convert start and end strings to number arrays
var st_arr = start.split('-').map(Number);
var en_arr = end.split('-').map(Number);
// outputs arrays with month first, year next

// Functions: converting date to range (once) and range val to date
//     (every time slider is moved)
// 
// ----fcn 1----
// Take input dates (from slider HTML) and convert to min/max range values
function minMaxDateToRange() {
  // calculate the # of months difference in range
  var st_num = st_arr[0] + (st_arr[1]-1)*12;
  var en_num = en_arr[0] + (en_arr[1]-1)*12;
  var range = en_num - st_num;
  // update slider min and max vals
  slider.min = 0;
  slider.max = range;
  slider.value = range;
}

// ----fcn 2----
// Map with the month # and corresponding month name
const months = new Map();
months.set(1, "January");
months.set(2, "February");
months.set(3, "March");
months.set(4, "April");
months.set(5, "May");
months.set(6, "June");
months.set(7, "July");
months.set(8, "August");
months.set(9, "September");
months.set(10, "October");
months.set(11, "November");
months.set(12, "December");
// Convert current value to the date (in string format)
function valToDate() {
  // retrieve the current value
  var val = slider.value;

  // make new variables for the current month and year
  var curr_year = st_arr[1] + Math.floor(val/12);
  var curr_mon;
  // calculate current month
  // first, find remainder (num of months left)
  var rem = val%12;
  // next, check if 12 - start month is smaller than the rem
  if (12 - st_arr[0] < rem) {
    curr_year += 1;
    curr_mon = rem - (12 - st_arr[0]);
  } else {
    curr_mon = st_arr[0] + rem;
  }

  // returns as M-Y
  return curr_mon + "-" + curr_year;
}

// ----fcn 3----
// given a month # and a year (in string format), update the displayed html
function updateHTML(monyr) {
  // convert the string to an array
  var monyr_arr = monyr.split('-').map(Number);
  // update the HTML displayed
  out_mon.innerHTML = months.get(monyr_arr[0]);
  out_year.innerHTML = monyr_arr[1];
}

// these functions are called upon page load
// set the range values (only need to set once)
minMaxDateToRange()
// display the default slider value (the most recent date, highest value)
updateHTML(end);
// display the most recent contour map (retrieve end date)
updateMap(end);

// Update the displayed slider value (each time you drag the slider handle)
// Updates the map displayed as well
slider.oninput = function() {
  mon = valToDate();
  updateHTML(mon);
  updateMap(mon);
}