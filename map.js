var map = L.map('map').setView([43.814654, -111.784797], 19);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//tools controls


L.marker([43.814672, -111.784795]).addTo(map)
    .bindPopup('The Science and Technology Center<br> What is your class?')
    .openPopup();

    
var imageUrl = '/img/1st Floor.png',
    imageBounds = [[43.814852, -111.785487], [43.814288, -111.784096]];
L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
//43°48'51.3"N 111°47'02.5"W

// Add the draw control (this enables the toolbar)
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        polygon: true,
        polyline: true,
        circle: true,
        rectangle: true,
        marker: true,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

// Event handlers (optional)
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
});