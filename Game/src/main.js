import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Capture The Flaginator',
    description: 'A Capture the flag game in the STC',
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#FFFFFF',
    pixelArt: false,
    scene: [
        Boot,
        Game,
        Preloader,
        Start,

    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config);
            