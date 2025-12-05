
// import ASSETS from "src\assets.js"
export default class Player extends Phaser.Physics.Arcade.Sprite {

    // VelocityIncrement = 50;
    // VelocityMax = 200;
    // drag = 1000;
    // health = 100;



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


    // checkInput() {
    //     // Grab all the cursors
    //     const cursors = this.scene.cursors;

    //     // Set all the keys as variables.
    //     const LeftKey = cursors.left.isDown;
    //     const RightKey = cursors.right.isDown;
    //     const upKey = cursors.up.isDown;
    //     const downKey = cursors.down.isDown;
    //     const spaceKey = cursors.space.isDown;

    //     // Set the default movement as none if no keys are pressed.
    //     const moveDirection = { x: 0, y: 0 };

    //     if (leftKey) moveDirection.x--;
    //     if (rightKey) moveDirection.x++;
    //     if (upKey) moveDirection.y--;
    //     if (downKey) moveDirection.y++;
    //     if (spaceKey) this.PickUpFlag();

    //     // increment the movespeed as the directional key is held down.
    //     // Exp: left key is pressed and x goes to -1 and is multiplied
    //     // by 50 so the move velocity is -50 so we move at a speed that
    //     // is noticable. This is in the x direction
    //     this.body.velocity.x += moveDirection.x * this.velocityIncrement;

    //     // Do the same thing above but in the y axis.
    //     this.body.velocity.y += moveDirection.y * this.velocityIncrement;

    // }





    update() {
    if (!this.keys) return;

    this.setVelocity(0);

    let isMoving = false;

    // Horizontal movement + animations
    if (this.keys.left.isDown) {
        this.setVelocityX(-this.speed);
        isMoving = true;

        if (this.texLeft) this.setTexture(this.texLeft);

    } else if (this.keys.right.isDown) {
        this.setVelocityX(this.speed);
        isMoving = true;

        if (this.texRight) this.setTexture(this.texRight);
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
        this.setTexture(this.texStill);
    }

    // Limit diagonal movement speed
    if (this.body.velocity.length() > this.speed) {
        this.body.velocity.normalize().scale(this.speed);
    }
}
}
