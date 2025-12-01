export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc...)

    this.load.json("testMap", "src/src_game/assets/Final.geojson")
    this.load.image("RedStill", "src/src_game/assets/Team_Red_Still.png")
    this.load.image("RedLeft", "src/src_game/assets/Team_Red_Left.png")
    this.load.image("RedRight", "src/src_game/assets/Team_Red_Right.png")
    this.load.image("BlueStill", "src/src_game/assets/Team_Blue_Still.png")
    this.load.image("BlueLeft", "src/src_game/assets/Team_Blue_Left.png")
    this.load.image("BlueRight", "src/src_game/assets/Team_Blue_Right.png")

  }

  create() {

    

    this.scene.start('MainScreen')
  }
}
