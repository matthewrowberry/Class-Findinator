//import { Player } from './features/Player.js';

export class Map extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  preload() {
    this.load.json('testMap', 'assets/testMap.geojson');
    this.load.image("player", "assets/testChar2.png")
  }

  create() {
    
    const testMap = this.cache.json.get('testMap');
    console.log("Loaded map:", testMap);

    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;


    // Calculate coord bounds
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

    const lonRange = bounds.maxLon - bounds.minLon;
    const latRange = bounds.maxLat - bounds.minLat;

    //Maintain aspect ratio
    const mapAspect = lonRange / latRange;
    const screenAspect = canvasWidth / canvasHeight;

    let scaleX, scaleY, offsetX, offsetY;

    if (mapAspect > screenAspect) {
      scaleX = canvasWidth / lonRange;
      scaleY = scaleX;
      offsetX = 0;
      offsetY = (canvasHeight - (latRange * scaleY)) / 2;

    } else {
      scaleY = canvasHeight / latRange;
      scaleX = scaleY;
      offsetY = 0;
      offsetX = (canvasWidth - (lonRange * scaleX)) / 2;
    }


    // Draw Everything
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00FFFF, 1);


    testMap.features.forEach(f => {
    if (f.geometry.type === "Polygon") {
      f.geometry.coordinates.forEach(polygon => {
        const coords = polygon.map(c => this.convertCoords(c, bounds,scaleX, scaleY, offsetX, offsetY,
          canvasHeight)); // adjust scale
        graphics.beginPath();
        graphics.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) {
          graphics.lineTo(coords[i].x, coords[i].y);
        }
        graphics.closePath();
        graphics.strokePath();
      });
      
    } else if (f.geometry.type === "LineString") {
      const coords = f.geometry.coordinates.map(c => this.convertCoords(c, bounds, scaleX, scaleY, offsetX, offsetY,
          canvasHeight));
      graphics.beginPath();
      graphics.moveTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        graphics.lineTo(coords[i].x, coords[i].y);
      }
      graphics.strokePath();
    }
    });

    console.log("Bounds:", bounds);
    console.log("Canvas:", canvasWidth, canvasHeight);

    console.log("ScaleX:", scaleX, "ScaleY:", scaleY, "OffsetX:", offsetX, "OffsetY:", offsetY);




    this.player = this.add.sprite(400, 300, 'testChar2');
    this.cameras.main.startFollow(this.player);
    console.log("GeoJSON loaded: ",testMap)

    

  }

  convertCoords([lon, lat], bounds, 
          scaleX, scaleY, offsetX, offsetY,
          canvasHeight) {
    const { minLon, minLat, maxLat } = bounds;
    

    // Map longitude to x
    const x = (lon - minLon) * scaleX + offsetX;

    // map latitude to y (flip vertically so north is up)
    const y = canvasHeight - ((lat - minLat) * scaleY + offsetY);

    return { x, y };
  }
  
  update() {
    // Step 5: handle movement and interactions
    this.player.update();
  }
}



