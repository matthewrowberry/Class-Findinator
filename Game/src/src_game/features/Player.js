
// import ASSETS from "src\assets.js"
export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(scene, x, y, texture, network, controlType = "WASD") {
        super(scene.matter.world, x, y, texture);

        scene.add.existing(this);
    
        
        
        this.speed = 2;
        // Default animations (can be overridden by scene)
        this.texStill = texture;      // starting texture
        this.texLeft = null;
        this.texRight = null;

        this.network = network;

        this.setFixedRotation();
        this.setFrictionAir(0.05);
        this.setFriction(0, 0, 0);

        this.setCircle(35);

        // Assign controls based on type
        if (controlType === "WASD") {
            this.keys = scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                run: Phaser.Input.Keyboard.KeyCodes.M
            });
        } else if (controlType === "ARROWS") {
            this.keys = scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                run: Phaser.Input.Keyboard.KeyCodes.L
            });
        }
    }

    update() {
    if (!this.keys) return;

        let velocity = { x: 0, y: 0 };

        let isMoving = false;
        
        const texLeft = this.hasFlag && this.texLeftFlag ? this.texLeftFlag : this.texLeft;
        const texRight = this.hasFlag && this.texRightFlag ? this.texRightFlag : this.texRight;
        const texStill = this.hasFlag && this.texStillFlag ? this.texStillFlag : this.texStill;

        // Horizontal movement + animations
        if (this.keys.left.isDown) {
            velocity.x = -this.speed;
            isMoving = true;

            if (this.texLeft) this.setTexture(texLeft);

        } else if (this.keys.right.isDown) {
            velocity.x = this.speed;
            isMoving = true;

            if (this.texRight) this.setTexture(texRight);
        }
        if (this.keys.run.isDown){
            this.speed = 4;
        }else {
        this.speed = 2;
    }
        

        // Vertical movement
        if (this.keys.up.isDown) {
            velocity.y = -this.speed;
            isMoving = true;
        } else if (this.keys.down.isDown) {
            velocity.y = this.speed;
            isMoving = true;
        }

        this.setVelocity(velocity.x, velocity.y)

        // Return to still frame when not moving
        if (!isMoving) {
            this.setTexture(texStill);
        }

        // Limit diagonal movement speed
        
    }
}
