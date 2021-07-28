var btns = document.querySelectorAll('button');

// loop over
btns.forEach(function (btn) {
   // bind the click
   btn.addEventListener('click', function (evt) {
     var active = document.querySelector('button.active');

     if (active) {
         active.classList.remove('active');
     }
     this.classList.add('active');

     // update buttons div element to store the current pollen type
     var buttons_div = document.querySelector('.buttons');
     buttons_div.dataset.type = this.id;

     // update the map each time a button is clicked (with the right pollen type)
     updateMap();
   })
})