var map = L.map('map', { drawControl: true }).setView([43.814654, -111.784797], 19);

let geoJsonLayer = null;
let mode = 'draw';

let tempPolyline = null;
let previewPolyline = null;
let currentPoints = [];



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
    ],
};

function refreshGeoJsonLayer() {
    if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
    }

    geoJsonLayer = L.geoJSON(geoJson, {
        style: function (feature) {
            switch (feature.properties.name) {
                case 'Wall': return { color: 'black', weight: 3 };
                case 'walkable-area': return { color: 'green', fillOpacity: 0.3 };
                case 'non-walkable-area': return { color: 'red', fillOpacity: 0.4 };
                default: return { color: 'gray' };
            }
        },
        onEachFeature: function (feature, layer) {
            // Only bind popup in non-erase mode
            if (mode !== 'erase') {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name);
                }
            }

            // CRITICAL: Stop click propagation in erase mode
            layer.on('click', function (e) {
                if (mode === 'erase') {
                    L.DomEvent.stopPropagation(e); // Prevent map click
                    eraseNearestFeature(e.latlng);
                }
            });
        }
    }).addTo(map);
}

// Add different types of geoJson into map save.
function addFeature(type, points) {
    console.log(type);
    console.log(points);
    let feature = null;

    if (type == "wall") {
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
    else if (type == "walk") {
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
    else if (type == "noWalk") {
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


    if (feature) {
        geoJson.features.push(feature);

        refreshGeoJsonLayer();
        console.log('tried');
    }
}

function updatePreview(e) {
    if (mode !== 'draw' || currentPoints.length === 0) {
        // hide preview when not drawing or no points yet
        if (previewPolyline) {
            map.removeLayer(previewPolyline);
            previewPolyline = null;
        }
        return;
    }

    // build an array that ends with the mouse position
    const previewLatLngs = currentPoints.concat([[e.latlng.lat, e.latlng.lng]]);

    // create / update the preview polyline
    if (!previewPolyline) {
        previewPolyline = L.polyline(previewLatLngs, {
            color: 'rgba(0,120,255,0.6)',   // semi-transparent blue
            weight: 3,
            dashArray: '5,10'               // optional dashed style
        }).addTo(map);
    } else {
        previewPolyline.setLatLngs(previewLatLngs);
    }
}
// Test Wall Area


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

addFeature("wall", [[-111.78494215902532, 43.81452215796811],
[-111.78489318278858, 43.814521916037975],
[-111.78489350650473, 43.81447885245585],
[-111.78494240732802, 43.81447874157049],
[-111.78494278055466, 43.814507158297026]]);
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

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function eraseNearestFeature(clickLatLng) {
    const clickPoint = map.latLngToLayerPoint(clickLatLng);
    const tolerancePx = 15;
    let bestDist = Infinity;
    let bestLayer = null;

    geoJsonLayer.eachLayer(layer => {
        const feature = layer.feature;
        const latlngs = layer.getLatLngs();

        let rings;
        if (feature.geometry.type === "LineString") {
            rings = [latlngs]; // wrap in array for consistency
        } else if (feature.geometry.type === "Polygon") {
            rings = latlngs; // array of rings
        } else {
            return; // skip unsupported
        }

        rings.forEach(ring => {
            for (let i = 0; i < ring.length - 1; i++) {
                const p1 = ring[i];
                const p2 = ring[i + 1];
                const pt1 = map.latLngToLayerPoint(p1);
                const pt2 = map.latLngToLayerPoint(p2);
                const d = pointToSegmentDistance(
                    clickPoint.x, clickPoint.y,
                    pt1.x, pt1.y,
                    pt2.x, pt2.y
                );
                if (d < bestDist) {
                    bestDist = d;
                    bestLayer = layer;
                }
            }
        });
    });

    if (bestDist <= tolerancePx && bestLayer) {
        const featureToRemove = bestLayer.feature;
        const idx = geoJson.features.indexOf(featureToRemove);
        if (idx > -1) {
            geoJson.features.splice(idx, 1);
            refreshGeoJsonLayer();
        }
    }
}




function combine(arr1, arr2) {
    // Use the shorter array length to avoid undefined values
    const length = Math.min(arr1.length, arr2.length);
    const result = [];

    for (let i = 0; i < length; i++) {
        result.push([arr1[i], arr2[i]]);
    }

    return result;
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

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

const latitude = [];
const longitude = [];
let count = 0;
const lines = [];



// attach events

const finishButton = document.getElementById('Finish');
finishButton.addEventListener('click', () => {
    if (getRadio("type") != null && getRadio("type") != "none") {
        if (tempPolyline) map.removeLayer(tempPolyline);
        if (previewPolyline) {
            map.removeLayer(previewPolyline);
            previewPolyline = null;
        }
        let coords = combine(longitude, latitude);
        if (getRadio("type") != 'wall') {
            longitude.push(longitude[0]);
            latitude.push(latitude[0]);

            coords = [combine(longitude, latitude)];
        }
        addFeature(getRadio("type"), coords);
        latitude.length = 0;
        longitude.length = 0;
        currentPoints.length = 0;
        tempPolyline = null;

    }
});

function getRadio(label) {
    const selected = document.querySelector(`input[name="${label}"]:checked`);
    return selected ? selected.value : null;
}



map.on('mousemove', updatePreview);

map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    mode = getRadio("draw");


    if (mode === 'draw') {
        // --- DRAW MODE ---
        currentPoints.push([lat, lng]);
        latitude.push(lat);
        longitude.push(lng);
        count++;
        if (tempPolyline) map.removeLayer(tempPolyline);

        if (currentPoints.length >= 2) {
            tempPolyline = L.polyline(currentPoints, { color: 'blue', weight: 3 }).addTo(map);
        }

    } else if (mode === 'erase') {
        // --- ERASE MODE ---
        eraseNearestFeature(e.latlng);

    } else if (mode === 'measure') {
        // --- MEASURE MODE ---
        latitude.push(lat);
        longitude.push(lng);
        count++;
        if (count >= 2) {
            drawLine(latitude[0], longitude[0], latitude[1], longitude[1]);

            // clear data after one measurement
            latitude.length = 0;
            longitude.length = 0;
            count = 0;
        }
    }
});

function drawLine(lat1, lng1, lat2, lng2) {
    const line = L.polyline(
        [
            [lat1, lng1],
            [lat2, lng2]
        ],
        { color: 'blue' }
    ).addTo(map);

    lines.push(line);
}
