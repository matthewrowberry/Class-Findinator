import Player from './features/Player.js';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add to scene + physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enable collisions with world bounds
        this.setCollideWorldBounds(true);

        // Store movement speed
        this.speed = 200;

        // Set up WASD keys
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        // Reset velocity each frame
        this.setVelocity(0);

        // Movement
        if (this.keys.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.keys.right.isDown) {
            this.setVelocityX(this.speed);
        }

        if (this.keys.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (this.keys.down.isDown) {
            this.setVelocityY(this.speed);
        }

        // Optional: normalize diagonal movement
        if (this.body.velocity.length() > this.speed) {
            this.body.velocity.normalize().scale(this.speed);
        }
    }
}
