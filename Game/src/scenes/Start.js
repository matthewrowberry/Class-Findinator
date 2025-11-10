export class Start extends Phaser.Scene {
    constructor() {
        super({key: 'start'});
    }

    preload() {
        console.log("Start pre-loading")
        // The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        // this.load.image('background', 'assets/space.png');
        // this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.json("testMap", "assets/testmap.geojson")
        this.load.image("player", "assets/spaceship.png")
        this.cameras.main.setBounds(0, 0, 1920, 1080)
    }

    create() {
        this.background = this.add.tileSprite(1280, 720, 2560, 1440, 'background');
        
        const ship = this.add.sprite(1280, 720, 'ship');

        // world bounds
        this.physics.world.setBounds(0, 0, 2560, 1440);

        // background
        this.add.tileSprite(0, 0, 2560, 1440, 'background').setOrigin(0, 0);

        // player
        this.player = this.physics.add.sprite(1280 / 2, 720 / 2, 'ship');

        // camera
        const cam = this.cameras.main;
        cam.setBounds(0, 0, 2560, 1440);
        cam.startFollow(this.player);
        cam.setZoom(2);

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
        const speed = 300;
        this.ship.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.ship.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.ship.setVelocityY(speed);
        }
    }
    
}
