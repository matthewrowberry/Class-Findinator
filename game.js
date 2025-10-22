const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d1d1d',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
}

function create() {
  const logo = this.add.image(400, 300, 'logo');
  this.tweens.add({
    targets: logo,
    y: 500,
    duration: 1500,
    ease: 'Bounce.easeOut',
    yoyo: true,
    loop: -1
  });
}

function update() {}