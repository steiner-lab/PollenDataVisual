// boolean that says if animation should occur or not
var anim = false;

// animates the map
function animate() {
    if (slider.value < slider.max) {
        slider.value++;
        slider.dataset.currmon = valToDate();
    } else {
        slider.value = slider.min;
        slider.dataset.currmon = slider.dataset.start;
    }
    updateHTML();
    updateMap();
}

// hides/shows play and pause buttons 
$('#pause').hide();

// reacts when the play button is clicked: starts the animation
document.querySelector("#play").addEventListener("click", function() {
    $('#play').hide();
    $('#pause').show();
    // start animating
    anim = true;
    // creates a function that runs every second
    var interval = setInterval(function() {
        if (anim == true) {
            animate();
        } else {
            clearInterval(interval);
        }
    }, 1000);
});

// ends animation
document.querySelector("#pause").addEventListener("click", function() {
    $('#pause').hide();
    $('#play').show();
    anim = false;
});