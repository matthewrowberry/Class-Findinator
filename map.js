var map = L.map('map').setView([43.814654, -111.784797], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([43.814672, -111.784795]).addTo(map)
    .bindPopup('Here is this Location!<br> Look HERE!')
    .openPopup();

    
var imageUrl = '/img/1.png',
    imageBounds = [[43.814852, -111.785487], [43.814288, -111.784096]];
L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
//43°48'51.3"N 111°47'02.5"W

