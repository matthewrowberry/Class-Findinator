
import ASSETS from '../assets.js';
import ANIMATION from '../assets.js';
import Map from 'src\features\map.js';
import Player from 'src\features\map.js';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    // Step 1: load assets (images, GeoJSON, etc.)
  }

  create() {
    // Step 2–4: build world, physics bodies, and player
  }

  update() {
    // Step 5: handle movement and interactions
  }
}
