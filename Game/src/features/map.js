class MyGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  create() {
    // Step 2–4: build world, physics bodies, and player
        const testMap = this.cache.json.get('testMap');

        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00FFFF, 1);


        testMap.features.forEach(f => {
          if (f.geometry.type === "Polygon") {
            const coords = f.geometry.coordinates[0].map(c => this.convertCoords(c));
            graphics.beginPath()
            graphics.moveTo(coords[0].x, coords[0].y)
            for (let i = 1; i < coords.length; i++) {
              graphics.lineTo(coords[i].x, coords[i].y)
            }
            graphics.closePath();
            graphics.strokePath();              
          }
        });


        this.player = this.add.sprite(400, 300, 'player');
        this.cameras.main.startFollow(this.player);

  }

    convertCoords([lat, lon], scale = 10) {
      return { x: lon * scale, y: -lat * scale };
  }
  
  update() {
    // Step 5: handle movement and interactions

  }
}



