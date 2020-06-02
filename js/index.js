'use strict';

// storymap_data can be an URL or a Javascript object
let storymap_data = 'data/volcanoes.json';

// certain settings must be passed within a separate options object
// let storymap_options = {};
//
// let storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
// window.onresize = function(event) {
//     storymap.updateDisplay(); // this isn't automatic
// }

// Create map object
let mymap = L.map('map', {
  center: [39.8282, -98.5795],
  zoom: 3,
  maxZoom: 10,
  minZoom: 3,
  detectRetina: true
});

let volcanoes = null;

// add base mymap
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

var colors = chroma.scale('Set2').mode('lch').colors(2);

// dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// add airports to the map
// add airports GeoJson data
volcanoes = L.geoJson.ajax("assets/volcanoes.json", {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.V_Name);
},
  pointToLayer: function (feature, latlng){
    let id = 0;
    if(feature.properties.H_active == 0){
      id = 0;
    }else{
      id = 1;
    }
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'fas fa-mountain marker-color-' + (id + 1).toString()
      })
    });
  },
  attribution: 'Volcano Data &copy; USGS | US States &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Isabella Garcia'
}).addTo(mymap);

let legend = L.control({
  position: 'topright'
});

legend.onAdd = function(){
  let div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b>Number of Vocanoes</b><br />';
    div.innerHTML += '<i class="fas fa-mountain marker-color-1"></i><p> not active</p>';
    div.innerHTML += '<i class="fas fa-mountain marker-color-2"></i><p> active</p>';

    //return the legend div containing the html content
    return div;
};

// add legend to Map
legend.addTo(mymap);


// add scale bar
L.control.scale({position: 'bottomleft'}).addTo(mymap);
