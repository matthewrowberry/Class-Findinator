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