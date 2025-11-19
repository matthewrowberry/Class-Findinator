export class MainScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScreen' });
  }

  create() {
    // Get center of screen
    const { width, height } = this.scale;

    // Create a text button
    const startButton = this.add.text(width / 2, height / 2, "START", {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    // What happens when clicked:
    startButton.on('pointerdown', () => {
      this.scene.start('Start');
    });
  }
}
