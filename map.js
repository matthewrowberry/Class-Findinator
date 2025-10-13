var map = L.map('map', { drawControl: true }).setView([43.814654, -111.784797], 19);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//tools controls


// L.marker([43.814672, -111.784795]).addTo(map)
//     .bindPopup('The Science and Technology Center<br> What is your class?')
//     .openPopup();


var imageUrl = '/img/1st Floor.png',
    imageBounds = [[43.814852, -111.785487], [43.814288, -111.784096]];
var image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);


document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            map.removeLayer(image); // Remove the previous image overlay if it exists
            const imageUrl = e.target.result;

            image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
        };
        reader.readAsDataURL(file);
    }
});
//43°48'51.3"N 111°47'02.5"W

//let's make these sliderss in the future
//move the image overlay as desired
document.getElementById('up').addEventListener('click', function () {
    imageBounds[0][0] += 0.000001;
    imageBounds[1][0] += 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('down').addEventListener('click', function () {
    imageBounds[0][0] -= 0.000001;
    imageBounds[1][0] -= 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('left').addEventListener('click', function () {
    imageBounds[0][1] += 0.000001;
    imageBounds[1][1] += 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('right').addEventListener('click', function () {
    imageBounds[0][1] -= 0.000001;
    imageBounds[1][1] -= 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('zoomIn').addEventListener('click', function () {
    imageBounds[0][0] += 0.000001;
    imageBounds[1][0] -= 0.000001;
    imageBounds[0][1] -= 0.000001;
    imageBounds[1][1] += 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('zoomOut').addEventListener('click', function () {
    imageBounds[0][0] -= 0.000001;
    imageBounds[1][0] += 0.000001;
    imageBounds[0][1] += 0.000001;
    imageBounds[1][1] -= 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('STCButton').addEventListener('click', function () {
    map.whenReady(() => {
        AddMarker(43.814672, -111.784795, "STC Building");
    });
});
document.getElementById('RicksButton').addEventListener('click', function () {
    map.whenReady(() => {
        AddMarker(43.814859537991715, -111.78104934795863, "Ricks Building");
    });
});
document.getElementById('ManwaringCenterButton').addEventListener('click', function () {
    map.whenReady(() => {
        AddMarker(43.81843055825238, -111.78261029361335, "Manwaring Center");
    });
});


const geoJson ={
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [102.0, 0.5]
            },
            properties:{
                name: "Example Point",
            },
        },
    ],
}

const geoJsonStr = JSON.stringify(geoJson, null, 2)

const blob = new Blob([geoJsonStr], { type: "application/json" })

const link = document.createElement("a")
link.href = URL.createObjectURL(blob)
link.download = "data.geojson"
link.click()

URL.revokeObjectURL(link.href)

function AddMarker(lat, lng, markername) {
    L.marker([lat, lng]).addTo(map)
    .bindPopup(markername)
    .openPopup();
    map.flyTo([lat, lng], 19, {
            animate: true,
            duration: 1.5
        });
}



document.getElementById('save').addEventListener('click', function () {
    overlaySave();
});

function overlaySave() {
    //generate json


    fetch("files.json")
        .then(response => response.json()) // Parse response as JSON
        .then(data => console.log(data))  // Handle the data
        .catch(error => console.error('Error:', error));

