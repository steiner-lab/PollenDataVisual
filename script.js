// leaflet code from https://leafletjs.com/examples/choropleth/

// canvas makes loading slightly faster
var map = L.map('map', {
    renderer: L.canvas()
}).setView([39, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

function style(feature) {
    return {
        // weight is the line/border thickness
        weight: 1,
        opacity: 1,
        // color is the outline color
        color: feature.properties.fill,
        dashArray: '1',
        fillOpacity: 0.5,
        fillColor: feature.properties.fill
    };
}

// making geojson accessible by all functions
var geojson;

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

// FUNCTIONS FOR UPDATING MAP
// 
// 
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
    }).addTo(map);
}

// respond to and change map in response to user interaction event
function updateMap() {
    clearMap();
    var type = document.querySelector('.buttons').dataset.type;
    var mon = document.getElementById("myRange").dataset.currmon;
    url_head = "https://steiner-lab.github.io/PollenDataVisual/python1yr/"
    url = url_head + type + "/" + mon + ".json";

    geojsonUpdate(url);
}

// FUNCTIONS FOR LEGEND
// 
// 
// returns the grades array based on pollen type
// should be consistent with the levels in the python script for each type
function getScale() {
    var type = document.querySelector('.buttons').dataset.type;
    if (type == "all") {
        return [0, 1000, 2000, 5000, 10000, 20000, 50000];
    } else if (type == "dbf") {
        return [0, 500, 1000, 2000, 5000, 10000, 20000];
    } else if (type == "enf") {
        return [0, 1000, 2000, 5000, 10000, 20000, 50000];
    } else if (type == "gra") {
        return [0, 100, 200, 500, 1000, 2000, 5000];
    } else { // when the type is ragweed
        return [0, 100, 200, 500, 1000, 2000, 5000];
    }
}

// returns color shades (for legend) based on the pollen type
function getColorScale() {
    var type = document.querySelector('.buttons').dataset.type;
    if (type == "all") {
        return ['#f2f0e9', '#BF55EC', '#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c'];
    } else if (type == "dbf") {
        return ['#f2f0e9', '#cde7d0', '#9ccfa2', '#6bb874', '#469350', '#2f6235', '#17311a'];
    } else if (type == "enf") {
        return ['#f2f0e9', '#ffd6b6', '#ffad6d', '#ff8424', '#da6000', '#914000', '#482000'];
    } else if (type == "gra") {
        return ['#f2f0e9', '#edd2c7', '#dca68f', '#cb7a57', '#a75633', '#6f3922', '#371c11'];
    } else { //ragweed
        return ['#f2f0e9', '#f4c0c0', '#ea8282', '#df4343', '#bb1f1f', '#7c1414', '#3e0a0a'];
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

// updates the legend when pollen type changes
function updateLegend() {
    // clears the current legend
    if (legend!=null)
        map.removeControl(legend);

    legend = L.control({position: 'topright'});

    // updates to the new legend (with new pollen type)
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = getScale(),
            labels = ['<strong> Max Pollen Count: grains/m<sup>3</sup> </strong>'],
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