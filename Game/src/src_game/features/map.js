import Player from '../features/Player.js';

export class Map extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  init(data) {
    // Receive the Photon client from the menu
    this.network = data.photon || null;
    this.network.scene = this; // update the scene reference if needed
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
  }

  create() {
    const testMap = this.cache.json.get('testMap');
    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

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
    this.player = new Player(this, 100, 100, 'RedStill', this.network, "WASD");
    this.player.texStill = "RedStill";
    this.player.texLeft = "RedLeft";
    this.player.texRight = "RedRight";
    this.player.setScale(0.25);
    this.player.body.setSize(70, 70);

    this.player2 = new Player(this, 200, 100, 'BlueStill', null, "ARROWS");
    this.player2.texStill = "BlueStill";
    this.player2.texLeft = "BlueLeft";
    this.player2.texRight = "BlueRight";
    this.player2.setScale(0.25);
    this.player2.body.setSize(70, 70);
    this.player2.setDepth(2);
    this.player2.hasFlag = false;

    this.player.setDepth(2);

    // --- FLAG SETUP ---
    this.flag = this.physics.add.sprite(300, 300, 'redflag');
    this.flag.setScale(0.5);
    this.flag.body.setSize(30, 30);
    this.flag.setCollideWorldBounds(true);
    this.flagHolder = null;
    this.player.hasFlag = false;

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
        });
      } else if (f.geometry.type === "LineString") {
        const coords = f.geometry.coordinates.map(c => this.convertCoords(c, bounds, scaleX, scaleY, offsetX, offsetY, canvasHeight));
        graphics.beginPath();
        graphics.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) graphics.lineTo(coords[i].x, coords[i].y);
        graphics.strokePath();
      }
    });

    // --- CAMERA ---
    const cam = this.cameras.main;
    cam.setBounds(0, 0, 2560, 1440);
    cam.startFollow(this.player);
    cam.setZoom(8);

    // --- INPUT ---
    this.keys = this.input.keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" });
    this.keys2 = this.input.keyboard.addKeys({ up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
    } else {
      const other = this.otherPlayers[actorNr];
      other.x = content.x;
      other.y = content.y;
    }
  }

  pickUpFlag(player) {
    this.flagHolder = player;
    player.hasFlag = true;
    this.flag.setVisible(false);
    this.flag.body.enable = false;
  }

  dropFlag(holder) {
    if (!holder) return;
    holder.hasFlag = false;
    this.flagHolder = null;
    this.flag.setVisible(true);
    this.flag.body.enable = true;
    this.flag.setPosition(holder.x, holder.y);
  }

  update() {
    if (this.player) this.player.update();
    if (this.player2) this.player2.update();

    if (this.flagHolder) {
      this.flag.x = this.flagHolder.x;
      this.flag.y = this.flagHolder.y;
    }

    if (this.network && this.player) {
      this.network.setPlayerState(this.player.x, this.player.y);
    }

    if (this.network && this.player) {
      const now = this.game.getTime();
      if (!this.lastNetUpdate || now - this.lastNetUpdate > 50) {
        this.network.setPlayerState(this.player.x, this.player.y);
        this.lastNetUpdate = now;
      }
    }
  }
}
