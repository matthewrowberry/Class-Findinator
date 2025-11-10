export class Map extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  preload() {
    this.load.json('testMap', 'assets/testMap.geojson');
  }

  create() {
    
    const testMap = this.cache.json.get('testMap');
    console.log("Loaded map:", testMap);

    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

    const lons = [], lats = [];
    testMap.features.forEach(f => {
      const coordsArray = (f.geometry.type === "Polygon")
        ? f.geometry.coordinates.flat()
        : f.geometry.coordinates;
      coordsArray.forEach(([lon, lat]) => {
        lons.push(lon);
        lats.push(lat);
      })
    })
    const bounds = {
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats)
    }

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00FFFF, 1);


    testMap.features.forEach(f => {
    if (f.geometry.type === "Polygon") {
      f.geometry.coordinates.forEach(polygon => {
        const coords = polygon.map(c => this.convertCoords(c, bounds, canvasWidth, canvasHeight)); // adjust scale
        graphics.beginPath();
        graphics.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) {
          graphics.lineTo(coords[i].x, coords[i].y);
        }
        graphics.closePath();
        graphics.strokePath();
      });
      
    } else if (f.geometry.type === "LineString") {
      const coords = f.geometry.coordinates.map(c => this.convertCoords(c, bounds, canvasWidth, canvasHeight));
      graphics.beginPath();
      graphics.moveTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        graphics.lineTo(coords[i].x, coords[i].y);
      }
      graphics.strokePath();
    }
    });



    this.player = this.add.sprite(400, 300, 'player');
    this.cameras.main.startFollow(this.player);
    console.log("GeoJSON loaded: ",testMap)

  }

  convertCoords([lon, lat], bounds, canvasWidth, canvasHeight) {
    const { minLon, maxLon, minLat, maxLat } = bounds;
    
    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;

    // Map longitude to x
    const x = ((lon - minLon) / lonRange) * canvasWidth;

    // map latitude to y (flip vertically so north is up)
    const y = canvasHeight - ((lat - minLat) / latRange) * canvasHeight;

    return { x, y };
  }
  
  update() {
    // Step 5: handle movement and interactions
    
  }
}



