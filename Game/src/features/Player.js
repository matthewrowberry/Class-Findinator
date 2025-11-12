import Player from './features/Player.js';
// import ASSETS from "src\assets.js"
export default class Player extends Phaser.Physics.Arcade.Sprite {
    
    // VelocityIncrement = 50;
    // VelocityMax = 200;
    // drag = 1000;
    // health = 100;



    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add to scene + physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enable collisions with world bounds
        this.setCollideWorldBounds(true);

        // Make the ship appear above other things like the map.
        // this.setDepth(100);
        // this.scene = scene;

        // Store movement speed / Set max.
        this.speed = 200;
        // this.setMaxVelocity(this.VelocityMax);
        // this.setDrag(this.drag);

        //Set up WASD keys
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
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
