export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc.)

    this.load.json("testMap", "src/src_game/assets/Final.geojson")
    this.load.image("player", "src/src_game/assets/testChar2.png")


    this.load.on('filecomplete', (key) => console.log(`✅ Loaded: ${key}`));
    this.load.on('loaderror', (file) => console.error(`❌ FAILED: ${file.key} - ${file.src}`));
  }

  create() {

    console.log('Player texture exists?', this.textures.exists('player'));

    this.scene.start('Start')
  }
}
