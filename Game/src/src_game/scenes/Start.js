
//import Player from '../features/Player.js';

export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        console.log("Start pre-loading")


    }

    create() {



        this.scene.start('map');
    }

    update() {

    }
}
