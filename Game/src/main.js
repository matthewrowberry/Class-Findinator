import { Boot } from './src_game/scenes/Boot.js';
import { Preloader } from './src_game/scenes/Preloader.js';
import { MainScreen } from './src_game/scenes/MainScreen.js';
import { Start } from './src_game/scenes/Start.js';
import { Map } from './src_game/features/map.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    title: 'Capture The Flaginator',
    description: 'A Capture the flag game in the STC',
    parent: 'game-container',
    width: 2560,
    height: 1440,
    backgroundColor: '#ffffffff',
    pixelArt: false,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        }
    },
    scene: [
        Boot,
        Preloader,
        MainScreen,
        Start,
        Map 
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
};

// Initialize Phaser game
const game = new Phaser.Game(config);
