// ####  ORIGINAL LEAFLET CODE  #####
// this is the code used from https://leafletjs.com/examples/choropleth/
// edited/with variations
// ######   ######   ######   ######

// original x: 37.8
// canvas makes loading slightly faster
var map = L.map('map', {
    renderer: L.canvas()
}).setView([39, -96], 4);
// var map = L.map('map').setView([39, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);


// may come back to use this for other info; not needed currently
// control that shows state info on hover
// var info = L.control();

// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info');
//     this.update();
//     return this._div;
// };

// info.update = function (props) {
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// };

// info.addTo(map);


// get color depending on population density value
// using for legend but not for map
// function getColor(d) {
//     // 0, 2500000, 5000000, 7500000, 10000000, 12500000, 15000000
//     return d > 15000000 ? '#d7191c' :
//             d > 12500000  ? '#d7191c' :
//             d > 10000000  ? '#fdae61' :
//             d > 7500000   ? '#ffffbf' :
//             d > 5000000   ? '#abdda4' :
//             d > 2500000   ? '#2b83ba' :
//                         '#f2f0e9';
// }

function style(feature) {
    return {
        // weight is the line/border thickness
        weight: 1,
        opacity: 1,
        // color: 'white',
        // color is the outline color
        color: feature.properties.fill,
        dashArray: '1',
        fillOpacity: 0.5,
        fillColor: feature.properties.fill
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    // info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        // mouseover: highlightFeature,
        mouseout: resetHighlight
        // click: zoomToFeature
    });
}

// geojson = L.geoJson(pollData, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


// might not need this code since using updateLegend() anyway
// var legend = L.control({position: 'topright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 2500000, 5000000, 7500000, 10000000, 12500000, 15000000],
//         labels = [],
//         from, to;

//     for (var i = 0; i < grades.length; i++) {
//         from = grades[i];
//         to = grades[i + 1];

//         labels.push(
//             '<i style="background:' + getColor(from + 1) + '"></i> ' +
//             from + (to ? '&ndash;' + to : '+'));
//     }

//     div.innerHTML = labels.join('<br>');
//     return div;
// };

// legend.addTo(map);
// ##### ORIGINAL LEAFLET CODE ENDS HERE #####
// @@@@@@@@
// @@@@@@@@

// ##### NEW CODE (FROM OTHER WEBSITES) #####
// @@@@@ this code will clear and redraw the map in response to user-end changes @@@@@
// clears the previous contour layer and updates it
function clearMap() {
    if (geojson!=null) {
        map.removeLayer(geojson);
    }
}

// ajax code from: https://gis.stackexchange.com/questions/68489/loading-external-geojson-file-into-leaflet-map
// converts geojson file to geojson leaflet layer, updates map to the new geojson
function geojsonUpdate(url){
    geojson = new L.GeoJSON.AJAX(url, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
}

// respond to and change map in response to user interaction event
// add if statements for loading the correct type of map (using the id of the buttons div)
// and add the id to file extension/folder
// make folder names be all, gra, rag, etc
function updateMap() {
    clearMap();
    mon = document.getElementById("myRange").dataset.currmon;
    // url_head = "https://steiner-lab.github.io/PollenDataVisual/python_convert/contour_json/";
    url_head = "https://steiner-lab.github.io/PollenDataVisual/python_1yr/dbf/"
    url = url_head + mon + ".json";

    geojsonUpdate(url);
}

// FUNCTIONS FOR LEGEND
// 
// 
// creating a get scale function: returns the grades array based on pollen type
// should be consistent with the levels in the python script for each type
function getScale() {
    var type = document.querySelector('.buttons').dataset.type;
    if (type == "all") {
        return [0, 2500000, 5000000, 7500000, 10000000, 12500000, 15000000];
    } else if (type == "dbf") {
        return [0, 250000, 500000, 750000, 1000000, 1250000, 15000000];
    } else if (type == "enf") {
        return [0, 200000, 500000, 700000, 1000000, 1200000, 15000000];
    } else if (type == "gra") {
        return [0, 250000, 500000, 750100, 1001200, 1250030, 150000500];
    } else { // when the type is ragweed
        return [0, 250020, 510000, 750100, 1001200, 1250030, 15000500];
    }
}

// returns color shades (for legend) based on the pollen type
function getColorScale() {
    var type = document.querySelector('.buttons').dataset.type;
    if (type == "all") {
        return ['#f2f0e9', '#BF55EC', '#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c'];
    } else {
        return ['#1cac78', '#4a5d23', '#006400', '#03c03c', '#177245', '#00693e', '#4f7942'];
    }
}

// adds commas to large numbers to make them more readable/user-friendly
function convertNumForm(num) {
    intNumForm = new Intl.NumberFormat('en-US');
    return intNumForm.format(num);
}

// gets legend color based on (inputted) grades and colorscale
function getColors(d, grades) {
    colorScale = getColorScale();
    return d > grades[6] ? colorScale[6] :
            d > grades[5]  ? colorScale[5] :
            d > grades[4]  ? colorScale[4] :
            d > grades[3]   ? colorScale[3] :
            d > grades[2]  ? colorScale[2] :
            d > grades[1]   ? colorScale[1] :
                        colorScale[0];
}

// adding function to update the legend (which will act whenver the pollen type changes)
function updateLegend() {
    // clears the current legend
    if (legend!=null)
        map.removeControl(legend);

    legend = L.control({position: 'topright'});

    // updates to the new legend (with new pollen type)
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = getScale(),
            labels = ['<strong> Pollen Flux: grains/m^2/day </strong>'],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            var from_form = convertNumForm(from);
            var to_form = convertNumForm(to);
    
            labels.push(
                '<i style="background:' + getColors(from + 1, grades) + '"></i> ' +
                from_form + (to ? '&ndash;' + to_form : '+'));
        }
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
    
    legend.addTo(map);
}

// original function call for updateLegend: first legend on page
var legend;
updateLegend();