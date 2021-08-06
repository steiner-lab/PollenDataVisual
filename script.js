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
    url_head = "https://steiner-lab.github.io/PollenDataVisual/convert/json/"
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
        return [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    } else if (type == "dbf") {
        return [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    } else if (type == "enf") {
        return [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    } else if (type == "gra") {
        return [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    } else { // when the type is ragweed
        return [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    }
}

// returns color shades (for legend) based on the pollen type
function getColorScale() {
    var type = document.querySelector('.buttons').dataset.type;
    if (type == "all") {
        return ['#f2f0e9', '#faedff', '#f1cfff', '#e8b6fc', '#BF55EC', '#2b83ba', '#abdda4', '#fcf065', '#fdae61', '#d7191c'];
    } else if (type == "dbf") {
        return ['#f2f0e9', '#dceede', '#b9debd', '#96ce9d', '#74bd7c', '#51ad5c', '#418a49', '#306837', '#204524', '#102212'];
    } else if (type == "enf") {
        return ['#f2f0e9', '#fee2cc', '#ffc699', '#ffa966', '#ff8d33', '#ff7000', '#cc5a00', '#994300', '#662d00','#331600'];
    } else if (type == "gra") {
        return ['#f2f0e9', '#f3e0d7', '#e7c1b0', '#dba289', '#cf8362', '#c3643b', '#9c502f', '#753c23', '#4e2817', '#27140b'];
    } else { //ragweed
        return ['#f2f0e9', '#f7d3d3', '#f0a7a7', '#e97b7b', '#e24f4f', '#db2323', '#af1c1c', '#831515', '#570e0e', '#2b0707'];
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
    return  d > grades[9] ? colorScale[9] :
            d > grades[8] ? colorScale[8] :
            d > grades[7] ? colorScale[7] :
            d > grades[6] ? colorScale[6] :
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