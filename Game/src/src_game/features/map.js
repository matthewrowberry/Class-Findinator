import Player from './Player.js';
//import PhotonClient from "../network/PhotonClient.js";
export class Map extends Phaser.Scene {
  constructor() {
    super({ key: 'map' });
  }

  preload() {
    this.load.json('testMap', 'src_game/assets/Final.geojson');
    // this.load.json('playerAnimationLeft', 'src_game/assets/animation_left.png');
    // this.load.json('playerAnimationRight', 'src_game/assets/animation_Right.png');

    this.load.json("testMap", "src/src_game/assets/Final.geojson")
    this.load.image("RedStill", "src/src_game/assets/Team_Red_Still.png")
    this.load.image("RedLeft", "src/src_game/assets/Team_Red_Left.png")
    this.load.image("RedRight", "src/src_game/assets/Team_Red_Right.png")
    this.load.image("BlueStill", "src/src_game/assets/Team_Blue_Still.png")
    this.load.image("BlueLeft", "src/src_game/assets/Team_Blue_Left.png")
    this.load.image("BlueRight", "src/src_game/assets/Team_Blue_Right.png")
    this.load.image("flag", "src/src_game/assets/blueflag.png")
    this.load.image("redflag", "src/src_game/assets/redflag.png")

  }

  create() {
    // --- NETWORK STARTUP ---
    //this.network = new PhotonClient(this);
    //this.network.connect();
    // ---------------------

    const testMap = this.cache.json.get('testMap');


    const canvasWidth = this.sys.game.config.width;
    const canvasHeight = this.sys.game.config.height;

    this.player = new Player(this, 100, 100, 'RedStill', this.network);
    this.player.setScale(0.25);
    this.player.body.setSize(70, 70)

    // Make sure player renders in front of the flag
    this.player.setDepth(2);


    // --- FLAG SETUP ---
    this.flag = this.physics.add.sprite(300, 300, 'redflag'); // Change starting position if needed
    this.flag.setScale(0.5);
    this.flag.body.setSize(30, 30);
    this.flag.setCollideWorldBounds(true);

    // Track who is holding the flag
    this.flagHolder = null;
    this.player.hasFlag = false;





    // Create a static physics group for walls (immovable boundaries)
    this.walls = this.physics.add.staticGroup();



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
          const coords = polygon.map(c => this.convertCoords(c, bounds, scaleX, scaleY, offsetX, offsetY,
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




    //this.player = this.add.sprite(400, 300, 'testChar2');
    //this.cameras.main.startFollow(this.player);
    console.log("GeoJSON loaded: ", testMap)

    const cam = this.cameras.main;
    cam.setBounds(0, 0, 2560, 1440);
    cam.startFollow(this.player);
    cam.setZoom(10);

    // This is the make the player sprite move.
    // this.player.anims.create({
    //         key: 'fly',
    //         frames: [
    //           key: animationleft,
    //           key: animationright,
    //         ]
    //         frameRate: 10,
    //         repeat: -1
    //     });

    // input
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // --- FLAG INPUT + SETTINGS ---
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.FLAG_PICKUP_RADIUS = 28; // distance player must be within to pick up the flag









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


  pickUpFlag(player) {
    this.flagHolder = player;
    player.hasFlag = true;

    this.flag.setVisible(false);
    this.flag.body.enable = false;

    console.log("Flag picked up!");
  }

  dropFlag(holder) {
    if (!holder) return;

    holder.hasFlag = false;
    this.flagHolder = null;

    this.flag.setVisible(true);
    this.flag.body.enable = true;
    this.flag.setPosition(holder.x, holder.y);

    console.log("Flag dropped!");
  }

  tryPickupFlag() {
    if (this.flagHolder) return;

    const dist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.flag.x, this.flag.y
    );

    if (dist <= this.FLAG_PICKUP_RADIUS) {
      this.pickUpFlag(this.player);
    }
  }

  handleTagAttempt() {
    // You cannot tag while holding the flag
    if (this.player.hasFlag) return;

    // Loop through other players (replace with your network player list)
    const others = this.network?.otherPlayers || [];

    for (let other of others) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        other.x, other.y
      );

      if (dist < 40) { // Tag distance
        console.log("Tagged player!");

        // If tagged player has the flag, they drop it
        if (other.hasFlag) {
          this.dropFlag(other);
        }

        return;
      }
    }
  }



  update(time, delta) {
    // Step 5: handle movement and interactions

    if (this.player) this.player.update();

    // SPACE PRESSED
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {

      // Try to pick up the flag
      this.tryPickupFlag();

      // If no flag pickup happened → try tagging
      if (!this.player.hasFlag) {
        this.handleTagAttempt();
      }
    }

    // If flag is held, attach it to the holder
    if (this.flagHolder) {
      this.flag.x = this.flagHolder.x;
      this.flag.y = this.flagHolder.y;
    }






    // if (this.network) {
    //    this.network.sendPlayerState(this.player.x, this.player.y);
    // }

  }
}




