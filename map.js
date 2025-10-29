var map = L.map('map', { drawControl: true }).setView([43.814654, -111.784797], 19);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// When user clicks on the map, it shows the lat and lon of where they clicked.
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
});


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

//-----------------------------------------------------------------------------
//Picture Slider adjuster.
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


//-----------------------------------------------------------------------------


// Button to save the geoJson information into a geoJson file.
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
                type: "LineString",
                coordinates: [
                    [-111.78, 43.81],
                    [1,1]
                ]
            },
            properties: {
                name: "Saved Line Map Points",
                description: "STC Room line locations"
            },
        }
    ],
};

// Add different types of geoJson into map save.
function addFeature(type, points) {
    feature = "";

    if(type=="wall"){
        feature = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: points
            },
            properties: {
                name: "Wall",
                description: "STC Room line locations"
            },
        };
    }
    else if(type=="walk"){
        feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: points
            },
            properties: {
                name: "walkable-area",
                description: "You can walk here"
            },
        };
    }
    else if(type="noWalk"){
        feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: points
            },
            properties: {
                name: "non-walkable-area",
                description: "You can't walk here"
            },
        };
    }

    geoJson.features.push(feature)
}

// Test Wall Area
addFeature("wall",  [[-111.78494215902532,43.81452215796811],
                    [-111.78489318278858, 43.814521916037975],
                    [-111.78489350650473, 43.81447885245585],
                    [-111.78494240732802, 43.81447874157049],
                    [-111.78494278055466, 43.814507158297026]]);

// Test Walk Area
addFeature("walk", [[[-111.78497704530064, 43.81452143217765],
                    [-111.7849336990262, 43.814664059911415],
                    [-111.78470813717772, 43.81450755143178],
                    [-111.78491079878144, 43.814440778657136],
                    [-111.78505163393007, 43.814432069159295],
                    [-111.78497704530064, 43.81452143217765]]]);
                    
// Test No Walk Area
addFeature("noWalk", [[[-111.7849304520281, 43.814523125688694],
                    [-111.7849324424039, 43.81454067570142],
                    [-111.78491633209768, 43.814539707981126],
                    [-111.78491984543295, 43.81454938518341],
                    [-111.78477960125181, 43.81454938518341],
                    [-111.78477814646658, 43.81447970929178],
                    [-111.78489186116929, 43.81447885245585],
                    [-111.78489286632133, 43.81452083743209]]]);

//-----------------------------------------------------------------------------                    

//1st Floor Walkable Area
//addFeature("walk", [[[]]])

//1st Floor Non-Walkable Area
//addFeature("noWalk", [[[]]])

//1st Floor Walls
//addFeature("wall", [[]])

//-----------------------------------------------------------------------------

//2nd Floor Walkable Area
//addFeature("walk", [[[]]])

//2nd Floor Non-Walkable Area
//addFeature("noWalk", [[[]]])

//2nd Floor Walls
//addFeature("wall", [[]])

//-----------------------------------------------------------------------------

//3rd Floor Walkable Area
//addFeature("walk", [[[]]])

//3rd Floor Non-Walkable Area
//addFeature("noWalk", [[[]]])

//3rd Floor Walls
//addFeature("wall", [[]])

//-----------------------------------------------------------------------------

L.geoJSON(geoJson, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name)
        }
    }
}).addTo(map)




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

//-----------------------------------------------------------------------------
// start in draw mode
let drawMode = true; 
const latitude = [];
const longitude = [];
let count = 0;
const lines = [];

const drawButton = document.getElementById('drawButton');
const eraseButton = document.getElementById('eraseButton');

drawButton.addEventListener('click', () => {
    drawMode = true;
    drawButton.style.background = 'lightblue';
    eraseButton.style.background = '';
});

eraseButton.addEventListener('click', () => {
    drawMode = false;
    eraseButton.style.background = 'lightcoral';
    drawButton.style.background = '';
});

// --- helper: compute pixel distance from a point to a line segment ---
function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
    const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
    if (t < 0) return Math.hypot(px - x1, py - y1);
    if (t > 1) return Math.hypot(px - x2, py - y2);
    const projx = x1 + t * dx;
    const projy = y1 + t * dy;
    return Math.hypot(px - projx, py - projy);
}

map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    if (drawMode) {
        // --- DRAW MODE ---
        latitude.push(lat);
        longitude.push(lng);
        count++;

        if (count >= 2) {
            const one = latitude[0];
            const two = longitude[0];
            const red = latitude[1];
            const blue = longitude[1];
            drawLine(one, two, red, blue);

            latitude.length = 0;
            longitude.length = 0;
            count = 0;
        }

    } else {
        // --- ERASE MODE ---
        const clickPoint = map.latLngToLayerPoint(e.latlng);
        const tolerancePx = 10; // how close (in pixels) you must click to delete a line

        // iterate backward so we can safely remove from array
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            if (!map.hasLayer(line)) continue;

            const latlngs = line.getLatLngs().flat(Infinity);
            let minDistPx = Infinity;

            // check each segment of the polyline
            for (let j = 0; j < latlngs.length - 1; j++) {
                const p1 = map.latLngToLayerPoint(latlngs[j]);
                const p2 = map.latLngToLayerPoint(latlngs[j + 1]);
                const d = pointToSegmentDistance(
                    clickPoint.x, clickPoint.y,
                    p1.x, p1.y,
                    p2.x, p2.y
                );
                if (d < minDistPx) minDistPx = d;
            }

            if (minDistPx <= tolerancePx) {
                map.removeLayer(line);
                lines.splice(i, 1);
                break; // remove one line per click
            }
        }
    }
});

function drawLine(one, two, red, blue) {
    const line = L.polyline(
        [
            [one, two],
            [red, blue]
        ],
        { color: 'blue' }
    ).addTo(map);

    lines.push(line);
}



