export class Boot extends Phaser.Scene {
    constructor () {
        super({key: 'Boot'});
    }

    preload() {
        console.log("Start pre-loading")


    }

    create () {
        this.scene.start('Preloader');
    }
}
