class Player extends Phaser.Scene {
  constructor() {
    super({ key: 'Player' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc.)
    this.player = this.physics.add.sprite(400, 300, 'player');
  }

  create() {
    // Step 2–4: build world, physics bodies, and player
    // Set up keyboard input for WASD
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Movement speed
    this.speed = 200;
  }

  update() {
    // Step 5: handle movement and interactions
    // Reset player velocity every frame
    this.player.setVelocity(0);
    // Horizontal movement
    if (this.keys.left.isDown) {
      this.player.setVelocityX(-this.speed);
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(this.speed);
    }

    // Vertical movement
    if (this.keys.up.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(this.speed);
    }

    // Optional: normalize diagonal movement
    if (this.player.body.velocity.length() > this.speed) {
      this.player.body.velocity.normalize().scale(this.speed);
    }
  }
}
