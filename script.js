// ####  ORIGINAL LEAFLET CODE  #####
// this is the code used from https://leafletjs.com/examples/choropleth/
// edited/with variations
// ######   ######   ######   ######
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(map);


// get color depending on population density value
// not currently using
function getColor(d) {
    // 0, 2500000, 5000000, 7500000, 10000000, 12500000, 15000000
    return d > 15000000 ? '#d7191c' :
            d > 12500000  ? '#d7191c' :
            d > 10000000  ? '#fdae61' :
            d > 7500000   ? '#ffffbf' :
            d > 5000000   ? '#abdda4' :
            d > 2500000   ? '#2b83ba' :
                        '#f2f0e9';
}

function style(feature) {
    return {
        // weight is the line/border thickness
        weight: 1,
        opacity: 1,
        // color: 'white',
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

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
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

geojson = L.geoJson(pollData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2500000, 5000000, 7500000, 10000000, 12500000, 15000000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
// ##### ORIGINAL LEAFLET CODE ENDS HERE #####
// @@@@@@@@
// @@@@@@@@

// ##### NEW CODE (FROM OTHER WEBSITES) #####
// @@@@@ this code will clear and redraw the map in response to user-end changes @@@@@

// clears the previous contour layer and updates it
function clearMap() {
    map.removeLayer(geojson)
}

// ajax code from: https://gis.stackexchange.com/questions/68489/loading-external-geojson-file-into-leaflet-map
// retrieve url from server (currently from github, make sure to store files in different server once changing away from github)
url = "https://steiner-lab.github.io/PollenDataVisual/python_convert/contour_json/4-13-2013.json"

// converts geojson file to geojson leaflet layer, updates map to the new geojson
function geojsonUpdate(url){
    geojson = new L.GeoJSON.AJAX(url, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
}

// function calls: clearing and updating the map
clearMap();
geojsonUpdate(url);

// test function: respond to and change map in response to user interaction event
function updateMap(mon) {
    clearMap();
    // will add a function to convert the month + year to a specific format
    url_head = "https://steiner-lab.github.io/PollenDataVisual/python_convert/contour_json/"
    url = url_head + mon + ".json"

    geojsonUpdate(url);
}

// will update the event listener to work with a slider
// document.getElementById("button1").addEventListener("click", function() {
//     updateMap("4-3-2013");
// });