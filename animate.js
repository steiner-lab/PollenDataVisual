// testing out the animate function with the current 3 days
// slider.value = slider.min;
// slider.dataset.currmon = valToDate();
// updateMap();
// updateHTML();

// hides/shows play and pause buttons 
$('#pause').hide();

document.querySelector("#play").addEventListener("click", function() {
    $('#play').hide();
    $('#pause').show();
});

document.querySelector("#pause").addEventListener("click", function() {
    $('#pause').hide();
    $('#play').show();
});

// animates the map
function animate() {
    if (slider.value < slider.max) {
        slider.value++;
        slider.dataset.currmon = valToDate();
    }
    updateHTML();
    updateMap();
}

// add function to detect change in play/pause button
// maybe make the play and pause button change a boolean: if animate = true for ex

// setInterval(animate, 1000);