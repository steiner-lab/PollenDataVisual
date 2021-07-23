var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  var val = this.value;
  if (val == 1) {
    updateMap("4-3-2013");
  } else if (val == 2) {
    updateMap("4-13-2013");
  } else if (val == 3) {
    updateMap("4-23-2013");
  }
}