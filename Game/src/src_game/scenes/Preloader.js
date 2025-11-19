export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc.)

    this.load.json("testMap", "src/src_game/assets/Final.geojson")
    this.load.image("player", "src/src_game/assets/smile.png")


    
  }

  create() {

    

    this.scene.start('MainScreen')
  }
}
