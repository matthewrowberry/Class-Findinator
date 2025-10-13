var wall = false;

document.addEventListener('keyup', function (event) {
    if (event.key === 'w') {
        wall = !wall;
    }
});

map.on('click', function (e) {
    if (wall) {
        var marker = L.marker(e.latlng).addTo(map);
    }
});

function drawLine(coord1, coord2){
    const line = L.polylin([
        coord1
        coord2
    ], {color: 'blue' }).addTo(map);
};
// const line = L.polyline([
//   [43.814852, -111.785487],
//   [43.814288, -111.784096], 
//   [43.814852, -111.7857],
//   [43.814288, -111.784096]
//                      //blue line
  
// ], { color: 'blue' }).addTo(map);

