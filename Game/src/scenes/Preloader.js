class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc.)

    this.load.image('background', 'assets/space.png');
    this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    this.load.json("testMap", "assets\testmap.geojson")
  }

  create() {
    this.Scene.start('Game')
  }
}
