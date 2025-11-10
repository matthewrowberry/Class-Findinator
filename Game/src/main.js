import { Start } from './scenes/Start.js';
import { Map } from './features/map.js';


const config = {
    type: Phaser.AUTO,
    title: 'Capture The Flaginator',
    description: 'A Capture the flag game in the STC',
    parent: 'game-container',
    width: 2560,
    height: 1440,
    backgroundColor: '#000000ff',
    pixelArt: false,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        
        }
    },
    scene: [
        // Boot,
        // Game,
        // Preloader,
        Start,
        Map,

    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config);
            