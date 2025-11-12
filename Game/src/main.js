import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Game } from './scenes/Game.js';
import { MainScreen } from './scenes/MainScreen.js';
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
        Boot,
        Game,
        Preloader,
        Start,
        Map,
        MainScreen,

    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config);
            