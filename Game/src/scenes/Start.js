
//import Player from '../features/Player.js';

export class Start extends Phaser.Scene {
    constructor() {
        super({key: 'start'});
    }

    preload() {
        console.log("Start pre-loading")

        this.load.json("testMap", "assets/testmap.geojson")
        this.load.image("player", "assets/testChar2.png")

    }

    create() {
        this.background = this.add.tileSprite(1280, 720, 2560, 1440, 'background');

        // world bounds
        this.physics.world.setBounds(0, 0, 4560, 2440);

        // background
        this.add.tileSprite(0, 0, 2560, 1440, 'background').setOrigin(0, 0);

        // player
        this.player = this.physics.add.sprite(1280 / 2, 720 / 2, 'testChar2');

        // camera
        const cam = this.cameras.main;
        cam.setBounds(0, 0, 2560, 1440);
        cam.startFollow(this.player);
        cam.setZoom(0.4);
        
        

        // input
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.scene.start('map');
    }

    update() {
        console.log("update")
        const speed = 300;
        this.player.setVelocity(0);

        if (this.keys.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.keys.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.keys.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.keys.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }
}
