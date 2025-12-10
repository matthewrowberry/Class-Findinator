import Player from '../features/Player.js';

export class Map extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  init(data) {
    // Receive the Photon client from the menu
    this.network = data.photon || null;

    // Only set scene if network exists
    if (this.network) {
        this.network.scene = this;
    }
}


  preload() {
    this.load.json("testMap", "src/src_game/assets/Final.geojson");
    this.load.image("RedStill", "src/src_game/assets/Team_Red_Still.png");
    this.load.image("RedLeft", "src/src_game/assets/Team_Red_Left.png");
    this.load.image("RedRight", "src/src_game/assets/Team_Red_Right.png");
    this.load.image("BlueStill", "src/src_game/assets/Team_Blue_Still.png");
    this.load.image("BlueLeft", "src/src_game/assets/Team_Blue_Left.png");
    this.load.image("BlueRight", "src/src_game/assets/Team_Blue_Right.png");
    this.load.image("flag", "src/src_game/assets/blueflag.png");
    this.load.image("redflag", "src/src_game/assets/redflag.png");

    this.load.image("RedStillFlag", "src/src_game/assets/Team_Red_Still_Flag.png");
    this.load.image("RedLeftFlag", "src/src_game/assets/Team_Red_Left_Flag.png");
    this.load.image("RedRightFlag", "src/src_game/assets/Team_Red_Right_Flag.png");

    this.load.image("BlueStillFlag", "src/src_game/assets/Team_Blue_Still_Flag.png");
    this.load.image("BlueLeftFlag", "src/src_game/assets/Team_Blue_Left_Flag.png");
    this.load.image("BlueRightFlag", "src/src_game/assets/Team_Blue_Right_Flag.png");
  }

  create() {
    const testMap = this.cache.json.get('testMap');
    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

    // Set Matter world bounds to match the camera bounds
    this.matter.world.setBounds(0, 0, 2560, 1440);

    // PHOTON NETWORK HANDLER
    if (this.network) {
        console.log("Photon network received in Map Scene.");
        this.network.myEventHandler = (code, content, actorNr) => {
            if (code === 1) this.updateOtherPlayer(actorNr, content);
        };
        // Optional: Ready callback
        this.network.onNetworkReady = (client) => {
            console.log("Network fully ready!");
        };
    }


    this.otherPlayers = {};

    // --- PLAYER SETUP ---
    this.player = new Player(this, 110, 1200, 'RedStill', this.network, "WASD");
    this.player.texStill = "RedStill";
    this.player.texLeft = "RedLeft";
    this.player.texRight = "RedRight";
    this.player.texStillFlag = "RedStillFlag";
    this.player.texLeftFlag = "RedLeftFlag";
    this.player.texRightFlag = "RedRightFlag";
    this.player.setScale(0.25);
    this.player.setDepth(3);
    //this.player.setCollisionGroup(-1);

    this.player2 = new Player(this, 2430, 250, 'BlueStill', null, "ARROWS");
    this.player2.texStill = "BlueStill";
    this.player2.texLeft = "BlueLeft";
    this.player2.texRight = "BlueRight";
    this.player2.texStillFlag = "BlueStillFlag";
    this.player2.texLeftFlag = "BlueLeftFlag";
    this.player2.texRightFlag = "BlueRightFlag";
    this.player2.setScale(0.25);
    //this.player2.setCollisionGroup(-1); // Prevent player-player collisions
    this.player2.setDepth(3);
    this.player2.hasFlag = false;

    // --- SETUP ---
    this.flag = this.matter.add.sprite(350, 300, 'redflag');
    this.flag.setScale(0.5);
    this.flag.setRectangle(30, 30);
    this.flag.setCollisionGroup(-1);
    this.flagHolder = null;
    this.player.hasFlag = false;

    // === SCOREBOARD ===
    this.redScore = 0;
    this.blueScore = 0;

    // Just create the objects here
    this.scoreBox = this.add.graphics();
    this.scoreBox.setDepth(5);
    this.scoreBox.setScrollFactor(0);

    this.redScoreText = this.add.text(470, 260, 'Red: 0', {
        fontSize: '28px',
        color: '#ff4b4b'
    })

    this.blueScoreText = this.add.text(470, 260, 'Blue: 0', {
        fontSize: '28px',
        color: '#4b9bff'
    })
    // Inside create(), after creating the text:
    this.redScoreText.setScrollFactor(0).setDepth(1000).setScale(1 / this.cameras.main.zoom);
    this.blueScoreText.setScrollFactor(0).setDepth(1000).setScale(1 / this.cameras.main.zoom);
    this.scoreBox.setScrollFactor(0).setDepth(999).setScale(1 / this.cameras.main.zoom);



    // --- FLAG DROP-OFF ZONES ---
    const redzonecolor = this.add.graphics();
    redzonecolor.fillStyle(0xff0000, 1);   // Red, fully opaque
    redzonecolor.fillCircle(470, 260, 80);
    redzonecolor.setDepth(2);

    const bluezonecolor = this.add.graphics();
    bluezonecolor.fillStyle(0x0000FF, 1);   // Blue, fully opaque
    bluezonecolor.fillCircle(2330, 1085, 80);
    bluezonecolor.setDepth(2);


    this.redDropZone = { x: 470, y: 260, radius: 80 };   // radius in pixels
    this.blueDropZone = { x: 2330, y: 1085, radius: 80 };

    // --- MAP GENERATION ---
    const lons = [], lats = [];
    testMap.features.forEach(f => {
      const coordsArray = f.geometry.type === "Polygon" ? f.geometry.coordinates.flat() : f.geometry.coordinates;
      coordsArray.forEach(([lon, lat]) => {
        lons.push(lon);
        lats.push(lat);
      });
    });

    const bounds = {
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats)
    };

    const lonRange = bounds.maxLon - bounds.minLon;
    const latRange = bounds.maxLat - bounds.minLat;

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

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00FFFF, 1);

    testMap.features.forEach(f => {
      if (f.geometry.type === "Polygon") {
        f.geometry.coordinates.forEach(polygon => {
          const coords = polygon.map(c => this.convertCoords(c, bounds, scaleX, scaleY, offsetX, offsetY, canvasHeight));
          graphics.beginPath();
          graphics.moveTo(coords[0].x, coords[0].y);
          for (let i = 1; i < coords.length; i++) graphics.lineTo(coords[i].x, coords[i].y);
          graphics.closePath();
          graphics.strokePath();

          // Create static polygon body for collision
          const verts = coords;
          let centerX = 0, centerY = 0;
          verts.forEach(v => { centerX += v.x; centerY += v.y; });
          centerX /= verts.length;
          centerY /= verts.length;

          for (let i = 0; i < coords.length - 1; i++) {
            const p1 = coords[i];
            const p2 = coords[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            this.matter.add.rectangle(midX, midY, length, 5, {
              angle: angle,
              isStatic: true,
              render: { visible: true }
            });
          }
        });
      } else if (f.geometry.type === "LineString") {
        const coords = f.geometry.coordinates.map(c => this.convertCoords(c, bounds, scaleX, scaleY, offsetX, offsetY, canvasHeight));
        graphics.beginPath();
        graphics.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) graphics.lineTo(coords[i].x, coords[i].y);
        graphics.strokePath();

        // Create static bodies for each line segment
        for (let i = 0; i < coords.length - 1; i++) {
          const p1 = coords[i];
          const p2 = coords[i + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          this.matter.add.rectangle(midX, midY, length, 5, {
            angle: angle,
            isStatic: true,
            render: { visible: true }
          });
        }
      }
    });

    // --- CAMERA ---
    const mapWidth = lonRange * scaleX + 2 * offsetX;  // Account for offsets
    const mapHeight = latRange * scaleY + 2 * offsetY;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, mapWidth, mapHeight);
    cam.startFollow(this.player);
    cam.setZoom(6);

    // --- INPUT ---
    this.keys = this.input.keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" });
    this.keys2 = this.input.keyboard.addKeys({ up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interactP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interactP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.FLAG_PICKUP_RADIUS = 28;
  }

  convertCoords([lon, lat], bounds, scaleX, scaleY, offsetX, offsetY, canvasHeight) {
    const { minLon, minLat } = bounds;
    const x = (lon - minLon) * scaleX + offsetX;
    const y = canvasHeight - ((lat - minLat) * scaleY + offsetY);
    return { x, y };
  }

  updateOtherPlayer(actorNr, content) {
    if (!this.otherPlayers[actorNr]) {
      this.otherPlayers[actorNr] = new Player(this, content.x, content.y, 'BlueStill', null);
      this.otherPlayers[actorNr].setCollisionGroup(-1); // Prevent collisions
    } else {
      const other = this.otherPlayers[actorNr];
      other.x = content.x;
      other.y = content.y;
    }
  }

  pickUpFlag(player) {
    if (this.flagHolder)
      return

    this.flagHolder = player;
    player.hasFlag = true;
    this.flag.setVisible(false);
    this.matter.world.remove(this.flag.body);
  }

  dropFlag(holder) {
    if (!holder) return;
    holder.hasFlag = false;
    this.flagHolder = null;
    this.flag.setVisible(true);
    this.flag.setPosition(holder.x, holder.y);
    this.matter.world.add(this.flag.body);
  }

  scoreFlag(player) {
    console.log(`${player === this.player ? "Red" : "Blue"} team scored!`);

    // Drop the flag visually and reset holder
    this.dropFlag(player);

    // Reset flag to starting location
    this.flag.setPosition(370, 300);

    // Add scores
    if (player === this.player) {
    this.updateRedScore(1);
    } 
    else {
    this.updateBlueScore(1);
    }

  }

  updateRedScore(points) {
    this.redScore += points;
    this.redScoreText.setText('Red: ' + this.redScore);
    console.log("Red Score:", this.redScore);
  }

  updateBlueScore(points) {
    this.blueScore += points;
    this.blueScoreText.setText('Blue: ' + this.blueScore);
    console.log("Blue Score:", this.blueScore);
  }


  respawn(player) {
    this.x = 100;
    this.y = 100;
  }

  update() {
  // Scoreboard update
  const cam = this.cameras.main;
  const boxX = cam.width - 260 - 20; // 20px from right
  const boxY = 20;                   // 20px from top

  this.scoreBox.clear();
  this.scoreBox.fillStyle(0x000000, 0.5);
  this.scoreBox.fillRoundedRect(boxX, boxY, 260, 70, 10);

  this.redScoreText.setPosition(boxX + 10, boxY + 10);
  this.blueScoreText.setPosition(boxX + 10, boxY + 40);



  // Update players
  if (this.player) this.player.update();
  if (this.player2) this.player2.update();

  // === INTERACTION FOR PLAYER 1 ===
  if (Phaser.Input.Keyboard.JustDown(this.interactP1)) {
    // Try to pick up flag if nearby
    const distToFlag = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.flag.x, this.flag.y);
    if (!this.player.hasFlag && !this.flagHolder && distToFlag < this.FLAG_PICKUP_RADIUS) {
        this.pickUpFlag(this.player);
      }

    // Try to tag Player 2 if they have the flag
    if (this.player2.hasFlag) {
        const distToPlayer2 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.player2.x, this.player2.y);
        if (distToPlayer2 < this.FLAG_PICKUP_RADIUS) {
            this.dropFlag(this.player2);
        }
      }

    // --- Check Red Team drop-off ---
    if (this.player.hasFlag) {
        const distToRedZone = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.redDropZone.x, this.redDropZone.y
        );
        if (distToRedZone < this.redDropZone.radius) {
            this.scoreFlag(this.player);
        }
      }
  }

  // === INTERACTION FOR PLAYER 2 ===
  if (Phaser.Input.Keyboard.JustDown(this.interactP2)) {
    // Try to pick up flag if nearby
    const distToFlag = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, this.flag.x, this.flag.y);
    if (!this.player2.hasFlag && !this.flagHolder && distToFlag < this.FLAG_PICKUP_RADIUS) {
        this.pickUpFlag(this.player2);
    }

    // Try to tag Player 1 if they have the flag
    if (this.player.hasFlag) {
        const distToPlayer1 = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, this.player.x, this.player.y);
        if (distToPlayer1 < this.FLAG_PICKUP_RADIUS) {
            this.dropFlag(this.player);
        }
      }

      // --- Check Blue Team drop-off ---
    if (this.player2.hasFlag) {
        const distToBlueZone = Phaser.Math.Distance.Between(
            this.player2.x, this.player2.y,
            this.blueDropZone.x, this.blueDropZone.y
        );
        if (distToBlueZone < this.blueDropZone.radius) {
            this.scoreFlag(this.player2);
        }
      }
  }

  // Flag follow logic
  if (this.flagHolder) {
    this.flag.x = this.flagHolder.x;
    this.flag.y = this.flagHolder.y;
  }

  // Network updates...
  if (this.network && this.player) {
    const now = this.game.getTime();
    if (!this.lastNetUpdate || now - this.lastNetUpdate > 50) {
        this.network.setPlayerState(this.player.x, this.player.y);
        this.lastNetUpdate = now;
    }
}
}

}
