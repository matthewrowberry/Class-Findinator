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
        default: "matter",
        matter: {
            gravity: { y: 0 },
            debug: {
                showBody: false,          // Ensures dynamic bodies show
                showStaticBody: false,    // Ensures static walls show
                renderLine: false,        // Draw outlines (default anyway)
                lineThickness: 3,        // Increase from default 1 for visibility
                lineColor: 0xff0000,     // Red for dynamic bodies
                staticLineColor: 0x00ff00, // Green for static walls
                showVelocity: false,      // Optional: Shows movement arrows on player
                velocityColor: 0x0000ff, // Blue for velocity
                showCollisions: false,    // Highlights contact points on hit
                collisionColor: 0xffff00 // Yellow for collisions
            }
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
