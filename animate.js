// testing out the animate function with the current 3 days
slider.value = slider.min;
slider.dataset.currmon = valToDate();
updateMap();
updateHTML();

function animate() {
    if (slider.value < slider.max) {
        slider.value++;
        slider.dataset.currmon = valToDate();
    }
    updateHTML();
    updateMap();
}

setInterval(animate, 1000);