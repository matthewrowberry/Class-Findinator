
// import ASSETS from "src\assets.js"
export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, network, controlType = "WASD") {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.speed = 200;
    // Default animations (can be overridden by scene)
    this.texStill = texture;      // starting texture
    this.texLeft = null;
    this.texRight = null;

    this.network = network;

    // Assign controls based on type
    if (controlType === "WASD") {
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    } else if (controlType === "ARROWS") {
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });
    }
}

    update() {
    if (!this.keys) return;

    this.setVelocity(0);

    let isMoving = false;

    const texLeft = this.hasFlag && this.texLeftFlag ? this.texLeftFlag : this.texLeft;
    const texRight = this.hasFlag && this.texRightFlag ? this.texRightFlag : this.texRight;
    const texStill = this.hasFlag && this.texStillFlag ? this.texStillFlag : this.texStill;

    // Horizontal movement + animations
    if (this.keys.left.isDown) {
        this.setVelocityX(-this.speed);
        isMoving = true;

        if (this.texLeft) this.setTexture(texLeft);

    } else if (this.keys.right.isDown) {
        this.setVelocityX(this.speed);
        isMoving = true;

        if (this.texRight) this.setTexture(texRight);
    }

    // Vertical movement
    if (this.keys.up.isDown) {
        this.setVelocityY(-this.speed);
        isMoving = true;
    } else if (this.keys.down.isDown) {
        this.setVelocityY(this.speed);
        isMoving = true;
    }

    // Return to still frame when not moving
    if (!isMoving) {
        this.setTexture(texStill);
    }

    // Limit diagonal movement speed
    if (this.body.velocity.length() > this.speed) {
        this.body.velocity.normalize().scale(this.speed);
    }
}
}
