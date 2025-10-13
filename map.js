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


fetch("files.json")
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        const existingItem = data.find(item => item.image === imageUrl);
        imageBounds[0][0] = existingItem.x1;
        imageBounds[1][0] = existingItem.x2;
        imageBounds[0][1] = existingItem.y1;
        imageBounds[1][1] = existingItem.y2;
        map.removeLayer(image);
        image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
    }).catch(error => console.error('Error:', error));




document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            map.removeLayer(image); // Remove the previous image overlay if it exists
            imageUrl = file.name;

            const imageDataURL = e.target.result;

            image = L.imageOverlay(imageDataUrl, imageBounds, { opacity: 0.5 }).addTo(map);
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
document.getElementById('right').addEventListener('click', function () {
    imageBounds[0][1] += 0.000001;
    imageBounds[1][1] += 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('left').addEventListener('click', function () {
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

document.getElementById('tallenup').addEventListener('click', function () {
    imageBounds[0][0] += 0.000001;
    imageBounds[1][0] -= 0.000001;
    
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('tallendown').addEventListener('click', function () {
    imageBounds[0][0] -= 0.000001;
    imageBounds[1][0] += 0.000001;
    
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('widendown').addEventListener('click', function () {
    
    imageBounds[0][1] += 0.000001;
    imageBounds[1][1] -= 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});
document.getElementById('widenup').addEventListener('click', function () {
    
    imageBounds[0][1] -= 0.000001;
    imageBounds[1][1] += 0.000001;
    map.removeLayer(image);
    image = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.5 }).addTo(map);
});


document.getElementById('SaveMapButton').addEventListener('click', function () {
    const geoJsonStr = JSON.stringify(geoJson, null, 2)

    const blob = new Blob([geoJsonStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "data.geojson"
    link.click()

})


//GeoJson Collecting Information
const geoJson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [-111.78, 43.81]
            },
            properties: {
                name: "Saved Map Location"
            },
        },
    ],
};

L.geoJSON(geoJson, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name)
        }
    }
}).addTo(map)


//URL.revokeObjectURL(link.href)









document.getElementById('Player1').addEventListener('click', function () {
    map.whenReady(() => {
        if (FlagMarker != null) {
            map.removeLayer(FlagMarker);
            FlagMarker = null;
        }
        else
            FlagMarker = AddMarker([43.81502764600424, -111.78348485552259], "STC Building");
    });
});

document.getElementById('Player2').addEventListener('click', function () {
    map.whenReady(() => {
        if (FlagMarker != null) {
            map.removeLayer(FlagMarker);
            FlagMarker = null;
        }
        else
            FlagMarker = AddMarker([43.814672, -111.784795], "STC Building");
    });
});

document.getElementById('Player3').addEventListener('click', function () {
    map.whenReady(() => {
        if (FlagMarker != null) {
            map.removeLayer(FlagMarker);
            FlagMarker = null;
        }
        else
            FlagMarker = AddMarker([43.814672, -111.784795], "STC Building");
    });
});

document.getElementById('Player4').addEventListener('click', function () {
    map.whenReady(() => {
        if (FlagMarker != null) {
            map.removeLayer(FlagMarker);
            FlagMarker = null;
        }
        else
            FlagMarker = AddMarker([43.814672, -111.784795], "STC Building");
    });
});

const FlagIcon = L.icon({
    iconUrl: '/img/Flag.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

FlagMarker = null;
document.getElementById('Flag').addEventListener('click', function () {
    map.whenReady(() => {
        if (FlagMarker != null) {
            map.removeLayer(FlagMarker);
            FlagMarker = null;
        }
        else
            FlagMarker = AddMarker([43.814672, -111.784795], "STC Building");
    });
});

function AddMarker(lat, lng, markername) {
    L.marker([lat, lng], { icon: L.icon({ iconUrl: '/img/Flag.png', iconSize: [40, 40], iconAnchor: [20, 40], }) }).addTo(map).bindPopup(markername).openPopup();
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
        .then(data => {
            const newRow = { image: imageUrl, x1: imageBounds[0][0], y1: imageBounds[0][1], x2: imageBounds[1][0], y2: imageBounds[1][1] };

            const existingItem = data.find(item => item.image === newRow.image);


            if (existingItem) {
                existingItem.x1 = newRow.x1;
                existingItem.x2 = newRow.x2;
                existingItem.y1 = newRow.y1;
                existingItem.y2 = newRow.y2;
            } else {
                data.push(newRow);
            }


            const save = JSON.stringify(data, null, 2)

            const blob = new Blob([save], { type: "application/json" })

            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "files.json"
            link.click()


        })  // Handle the data
        .catch(error => console.error('Error:', error));
}





// austin = null;
//document.getElementById('AustinButton').addEventListener('click',function())
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    console.log(lat, lng);
});







// STCMarker = null;
// document.getElementById('STCButton').addEventListener('click', function () {
//     map.whenReady(() => {
//         if (STCMarker != null){
//             map.removeLayer(STCMarker);
//             STCMarker = null;
//         }
//         else
//             STCMarker = L.marker([43.814672, -111.784795], "STC Building").addTo(map);
//     });
// });